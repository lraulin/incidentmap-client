#!/usr/bin/env node

/**
 * Function to watch for Tweets with Twitter API. Requires a module with a
 * saveTweet method to be passed in as a parameter. (The required module is
 * taken as parameter instead of required so that the instance can be shared.)
 * Begins watching for Tweets when called and will continue indefinitely.
 */

const Twitter = require("twitter");
const incidentTypes = require("./incidentTypes");
const { findLocation } = require("./findLocation");
const { saveTweet } = require("./mongo");
const { yellow, red } = require("kleur");
const logger = require("../share/logger");

const twitterConfig = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

// Return appropriate category for tweet.
const categorize = tweet => {
  if (!tweet.id_str) {
    throw new TypeError("Not a Tweet!");
  }
  let type;
  /**
   * The text of the Tweet and some entity fields are considered for matches.
   * Specifically, the text attribute of the Tweet, expanded_url and
   * display_url for links and media, text for hashtags, and screen_name for
   * user mentions are checked for matches.
   */
  Object.keys(incidentTypes).forEach(typeKey => {
    const re = incidentTypes[typeKey].regex;
    let textToSearch = tweet.text;
    if (
      tweet.entities &&
      tweet.entities.urls &&
      tweet.entities.urls.expanded_url
    )
      textToSearch += " " + tweet.entities.urls.expanded_url;
    if (
      tweet.entities &&
      tweet.entities.urls &&
      tweet.entities.urls.display_url
    )
      textToSearch += " " + tweet.entities.urls.display_url;
    if (tweet.entities && tweet.entities.hashtags)
      textToSearch += " " + tweet.entities.hashtags.join(" ");
    if (
      tweet.entities &&
      tweet.entities.user_mentions &&
      Array.isArray(tweet.entities.user_mentions)
    ) {
      for (mention of tweet.entities.user_mentions) {
        textToSearch += " " + mention.screen_name;
      }
    }
    if (textToSearch.match(re)) {
      type = typeKey;
      logger.log("info", `Tweet ${tweet.id_str} matches type ${typeKey}.`);
    }
  });
  return type;
};

// Add data to tweet and save to database.
const processTweetStream = async data => {
  if (data.id_str) {
    if (data.user.verified === false) {
      logger.log("info", "User not verified...discarding Tweet.");
      return;
    }
    if (data.retweeted_status) {
      logger.log("info", "Tweet is a retweet...discarding.");
      return;
    }

    const _id = data.id_str;
    const type = categorize(data);
    const coords = await findLocation(data);
    if (!coords) {
      if (data.user && data.user.location) {
        logger.log(
          "warn",
          `Geocoding for ${data.user.location} failed. Discarding Tweet.`,
        );
      } else {
        logger.log(
          "warn",
          `Geolocation failed for tweet ${_id}. Discarding Tweet.`,
        );
      }
      return;
    }
    saveTweet({ _id, type, data, ...coords });
  }
};

// Initialize Twitter client.
const twitterClient = new Twitter(twitterConfig);

// Keywords to watch.
const searchString = (() =>
  Object.values(incidentTypes)
    .map(type => type.searchString)
    .join("|")
    .replace(/\ \%26|\(|\)/g, "")
    .replace(/\|/g, ","))();

// Begin watching for matching tweets.
const stream = twitterClient.stream("statuses/filter", {
  track: searchString,
});

// Initialize event listener to take action when a tweet matching keywords is found.
stream.on("data", event => {
  console.log(event && event.text);
  if (event.id_str) processTweetStream(event);
});

// Initialize event listener to handle errors.
stream.on("error", error => {
  console.log(red(error));
});
