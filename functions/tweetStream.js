#!/usr/bin/env node

const admin = require("firebase-admin");
const serviceAccount = require("./incident-report-map-firebase-adminsdk-rx0ey-6ec9058686.json");
const incidentTypes = require("./incidentTypes.js");
const secrets = require("./secrets.js");
const Twitter = require("twitter");
const axios = require("axios");
const colors = require("colors");
const { writeToFile } = require("./utils.js");

let searchString =
  "fatal crash,fatal car crash,fatal car accident,pedestrian killed,fatal truck accident,fatal truck crash,truck kill,bus kill,cyclist killed,bicyclist killed,pedestrian crash,pedestrian killed,bicyclist crash,bicyclist killed,cyclist crash,cyclist killed,truck crash,truck kill,fatal truck crash,fatal truck accident,bus crash,bus kill,transit crash,transit crash,transit kill,rail suicide,transit suicide,pipeline explosion,pipeline spills,hazardous spill,hazardous spills,train explosion,train explode,bike lane blocked,bus lane blocked,road closed,road closure,road flooded,road washed,bridge closed,bridge out,ran red light,blew red light,blew through red light,drone unauthorized";

const initializeTwitter = () =>
  new Twitter({
    consumer_key: secrets.twitterConfig.consumerKey,
    consumer_secret: secrets.twitterConfig.consumerSecret,
    access_token_key: secrets.twitterConfig.accessToken,
    access_token_secret: secrets.twitterConfig.accessTokenSecret
  });

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

const stream = () => {
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
};

console.log("Waiting for Tweets...");
stream();
