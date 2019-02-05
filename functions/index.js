#!/usr/local/bin/node

const admin = require("firebase-admin");
const serviceAccount = require("./incident-report-map-firebase-adminsdk-rx0ey-6ec9058686.json");
const incidentTypes = require("./incidentTypes.js");
const secrets = require("./secrets.js");
const Twitter = require("twitter");
const _ = require("lodash");
const axios = require("axios");
const fs = require("fs");
const colors = require("colors");

let searchString =
  "fatal crash,fatal car crash,fatal car accident,pedestrian killed,fatal truck accident,fatal truck crash,truck kill,bus kill,cyclist killed,bicyclist killed,pedestrian crash,pedestrian killed,bicyclist crash,bicyclist killed,cyclist crash,cyclist killed,truck crash,truck kill,fatal truck crash,fatal truck accident,bus crash,bus kill,transit crash,transit crash,transit kill,rail suicide,transit suicide,pipeline explosion,pipeline spills,hazardous spill,hazardous spills,train explosion,train explode,bike lane blocked,bus lane blocked,road closed,road closure,road flooded,road washed,bridge closed,bridge out,ran red light,blew red light,blew through red light,drone unauthorized";

// Seems filters can only be used with REST API, not Stream API
const filters = [
  "-filter:retweets",
  "-filter:nativeretweets",
  "filter:verified"
];

const trace = label => value => {
  console.log(`${label}: ${value}`);
};

const initializeTwitter = () =>
  new Twitter({
    consumer_key: secrets.twitterConfig.consumerKey,
    consumer_secret: secrets.twitterConfig.consumerSecret,
    access_token_key: secrets.twitterConfig.accessToken,
    access_token_secret: secrets.twitterConfig.accessTokenSecret
  });

let tweet_repo = [];
let rate_limit_exceeded = false;

const getFirebaseRef = () => {
  console.log("initialing firebase...");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incident-report-map.firebaseio.com"
  });

  const db = admin.database();
  return db.ref("tweets");
};

const ref = getFirebaseRef();

const writeToFile = (text, file) => {
  const stream = fs.createWriteStream(file, { flags: "a" });
  stream.write(text + "\n");
  stream.end();
};

const readFile = (path, opts = "utf8") =>
  new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });

const readJsonFile = async path => JSON.parse(await readFile(path));

const search_all_types = () => {
  // initiate a twitter search for each category
  Object.entries(incidentTypes).forEach(([key, value]) => {
    search_twitter(key, value.searchString)
      .then(res => saveData(tweet_repo))
      .catch(e => console.log(e));
  });
};

const exportFirebaseToJSON = () => {
  console.log("Exporting Firebase to JSON...".yellow);
  const filename = "tweets_export_" + Date.now() + ".json";
  const res = ref.once("value").then(snapshot => {
    const data = snapshot.val();
    writeToFile(JSON.stringify(data), filename);
  });
};

const search_twitter = async (incident_type, search_string, client) => {
  const filter_str = encodeURI(" " + filters.join(" "));

  const q = search_string.replace(" ", "") + filter_str;
  console.log(q);
  let max_id_str = null;
  let results = null;
  let tweets = [];
  while (tweets.length < 1500 && !rate_limit_exceeded) {
    try {
      results = await clientGet(client, q, max_id_str);
      if (!results.length) {
        break;
      }
      max_id_str = results.search_metadata.max_id_str;
      tweets = tweets.concat(results.statuses);
      if (tweets.length === 0) break;
    } catch (e) {
      console.log(e);
      break;
    }
  }
  _.remove(tweets, tweet => tweet.user.verified !== true);
  _.remove(tweets, tweet => !!tweet.retweeted_status);
  categorizeAll(tweets);
  tweet_repo = tweet_repo.concat(tweets);
};

const clientGet = async (client, q, max_id_str = null) => {
  let results = null;
  const options = { q, tweet_mode: "extended", lang: "en", count: 100 };
  if (max_id_str) options.max_id_str = max_id_str;
  try {
    results = await client.get("search/tweets", options);
  } catch (e) {
    if (e[0] && e[0].code === 88) {
      // rate limit exceeded; stop making requests
      console.log("Rate limit exceeded");
      rate_limit_exceeded = true;
    } else {
      console.log(e);
    }
  }
  return results;
};

const categorizeAll = tweets => {
  tweets.forEach(tweet => {
    try {
      if (!Array.isArray(tweet.incidentType)) {
        categorize(tweet);
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const categorize = tweet => {
  if (!tweet.id_str) {
    throw new TypeError("Not a Tweet!");
  }
  const types = [];
  Object.keys(incidentTypes).forEach(typeKey => {
    const re = incidentTypes[typeKey].regex;
    if (tweet.text.match(re)) {
      types.push(typeKey);
    }
  });
  tweet.incidentType = types;
  return tweet;
};

// returns promise that resolves to {Latitude, Longitude} for location string
const geocode = async location => {
  const encodedLocation = encodeURIComponent(location);
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${
    secrets.googleMapsApiKey
  }`;
  return axios
    .get(apiUrl)
    .then(res => {
      if (res.data && res.data.results[0]) {
        const lat = res.data.results[0].geometry.location.lat;
        const lng = res.data.results[0].geometry.location.lng;
        return {
          Latitude: lat,
          Longitude: lng
        };
      } else {
        return null;
      }
    })
    .catch(e => {
      console.log(e.toString().red);
      console.log("Unfound Location " + location);
    });
};

/**
 * Attempt to set tweet coordinates based on user location if geo data is not
 * avalable and return reference to Tweet. Throw error if Tweet is malformed.
 * */
const localizeTweet = async tweet => {
  if (!tweet.id_str) {
    throw new TypeError("Not a Tweet!");
  }

  if (!tweet.coordinates) {
    let location;
    try {
      location = tweet.user.location;
    } catch (e) {
      console.log(e);
      throw new TypeError("Not a Tweet!");
    }
    return { ...tweet, coordinates: await geocode(location) };
  } else {
    if (
      typeof tweet.coordinates.Latitude === "number" &&
      typeof tweet.coordinates.Longitude === "number"
    ) {
      // tweet already has lat/long
      return tweet;
    } else {
      // something is weird
      // tweet has something for coordinates, but not what it should
      throw new TypeError("coordinates object has incorrect properties");
    }
  }
};

const saveData = data => {
  if (!data) {
    throw new Error("Data is empty");
  }

  // If data is array of Tweets, transform to object with ids as keys
  if (Array.isArray(data)) {
    const obj = {};
    data.forEach(tweet => (obj[tweet.id_str] = tweet));
    data = obj;
  }

  // save data to mock database and return promise
  const JSON_SERVER_URL = "http://localhost:3001/posts";
  if (Object.keys(data).length) {
    axios.post(JSON_SERVER_URL, data);
  }
};

const processTweetStream = async data => {
  if (data.id_str) {
    if (data.user.verified === false) {
      console.log("User not verified...discarding Tweet.".yellow);
      return;
    }
    if (data.retweeted_status) {
      console.log("Tweet is a retweet...discarding.".yellow);
      //TODO: check if we have the original Tweet, and add it if not.
      return;
    }
    categorize(data);
    data = await localizeTweet(data);
    if (!data.coordinates) {
      console.log("Geolocation failed. Discarding Tweet.".yellow);
      return;
    }
    saveTweetToFirebase(data);
  }
};

// Save Tweet to Firebase, adding to tweets node with id_str as key
const saveTweetToFirebase = tweet => {
  ref.child(tweet.id_str).update(tweet, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Tweet added successfully!".green);
    }
  });
};

const mainSearch = () => {
  search_all_types();
  console.log(`${tweet_repo.length} tweets found`);
};

function stream() {
  const client = initializeTwitter();
  const stream = client.stream("statuses/filter", { track: searchString });
  stream.on("data", function(event) {
    console.log(event && event.text);
    writeToFile(
      `\nUTS: ${Date.now()}\n${JSON.stringify(event)}`,
      "tweetStream.json"
    );
    if (event.id_str) {
      processTweetStream(event);
    }
  });
}

const main = () => {
  console.log("Waiting for Tweets...");
  stream();
};

const deleteAndSaveStreamData = () => {
  console.log("Finding keys to delete....");
  const filename = "stream_tweets" + Date.now() + ".json";
  try {
    const res = ref.once("value").then(snapshot => {
      const streamTweets = [];
      const keysToDelete = [];
      const data = snapshot.val();
      Object.keys(data).forEach(key => {
        console.log(key);
        const { entities, quoted_status } = data[key];
        // remove any quote links
        if (entities && quoted_status) {
          entities.urls.forEach(u => {
            console.log(u.expanded_url);
          });
        }
      });
      const numTweets = Object.keys(data).length;
      console.log(`found ${numTweets} tweets`);
      console.log(
        `Saving ${Object.keys(keysToDelete).length} misshapen Tweets`
      );
      process.exit();
      writeToFile(JSON.stringify(streamTweets), filename);
      try {
        keysToDelete.forEach(key => {
          console.log("deleting key " + key);
          ref.child(key).remove();
        });
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const countEntities = async () => {
  const data = await readJsonFile("tweets_export_1547042927484.json");
  const tweets = Object.values(data);
  const p = tweet => "entities" in tweet;
  const hasEntities = tweets.filter(p);
  const urls = tweet => !("urls" in tweet.entities);
  const nourls = hasEntities.filter(urls);
  console.log(nourls.length);
};

const putBack = async () => {
  const tweetArr = JSON.parse(
    await readFile("stream_tweets1547658581493.json")
  );
  console.log(tweetArr);
};

const firebaseDeleteAll = async () => {
  await ref.set(tweets{});
}

firebaseDeleteAll();