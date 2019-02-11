#!/usr/bin/env node

const { twitterConfig } = require("./secrets.js");
const colors = require("colors"); // eslint-disable-line
const postgresModule = require("./postgres/postgresModule.js");
const logger = require("./logger.js");

const logWarn = str => {
  console.log(str.yellow);
  logger.warn(str);
};

const logVerbose = str => {
  console.log(str);
  logger.verbose(str);
};

const categorize = tweet => {
  const incidentTypes = require("./incidentTypes.js");
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

const processTweetStream = async data => {
  const findLocation = require("./findLocationModule.js");
  if (data.id_str) {
    if (data.user.verified === false) {
      logWarn("User not verified...discarding Tweet.");
      return;
    }
    if (data.retweeted_status) {
      logWarn("Tweet is a retweet...discarding.");
      return;
    }
    categorize(data);
    data = await findLocation(data);
    if (!data.coordinates) {
      if (data.user && data.user.location) {
        logWarn(
          `Geocoding for ${data.user.location} failed. Discarding Tweet.`
        );
      } else {
        logWarn("Geolocation failed. Discarding Tweet.");
      }
      return;
    }
    postgresModule.saveTweet(data);
  }
};

const start = () => {
  const Twitter = require("twitter");
  const twitterClient = new Twitter(twitterConfig);
  const searchString =
    "fatal crash,fatal car crash,fatal car accident,pedestrian killed,fatal truck accident,fatal truck crash,truck kill,bus kill,cyclist killed,bicyclist killed,pedestrian crash,pedestrian killed,bicyclist crash,bicyclist killed,cyclist crash,cyclist killed,truck crash,truck kill,fatal truck crash,fatal truck accident,bus crash,bus kill,transit crash,transit crash,transit kill,rail suicide,transit suicide,pipeline explosion,pipeline spills,hazardous spill,hazardous spills,train explosion,train explode,bike lane blocked,bus lane blocked,road closed,road closure,road flooded,road washed,bridge closed,bridge out,ran red light,blew red light,blew through red light,drone unauthorized";

  const stream = twitterClient.stream("statuses/filter", {
    track: searchString
  });

  stream.on("data", event => {
    logVerbose(event && event.text);
    if (event.id_str) processTweetStream(event);
  });

  stream.on("error", error => {
    throw error;
  });
};

start();
