#!/usr/bin/env node

/**
 * Function to watch for Tweets with Twitter API. Requires a module with a
 * saveTweet method to be passed in as a parameter. (The required module is
 * taken as parameter instead of required so that the instance can be shared.)
 * Begins watching for Tweets when called and will continue indefinitely.
 */

const Twitter = require("twitter");
const incidentTypes = require("./incidentTypes");
const findLocation = require("./findLocation");
const postgresModule = require("./postgres");
const { twitterConfig } = require("./secrets");
const { yellow, red, green } = require("kleur");

// Apply matching incidentType categories to tweet.
const categorize = tweet => {
  if (!tweet.id_str) {
    throw new TypeError("Not a Tweet!");
  }
  const types = [];
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
    if (textToSearch.match(re)) types.push(typeKey);
  });
  tweet.incidentType = types;
  return tweet;
};

// Add data to tweet and save to database.
const processTweetStream = async data => {
  if (data.id_str) {
    if (data.user.verified === false) {
      console.log(yellow("User not verified...discarding Tweet."));
      return;
    }
    if (data.retweeted_status) {
      console.log(yellow("Tweet is a retweet...discarding."));
      return;
    }
    categorize(data);
    data = await findLocation(data);
    if (!data.coordinates) {
      if (data.user && data.user.location) {
        console.log(
          yellow(
            `Geocoding for ${data.user.location} failed. Discarding Tweet.`
          )
        );
      } else {
        console.log(yellow("Geolocation failed. Discarding Tweet."));
      }
      return;
    }
    postgresModule.saveTweet(data);
    console.log(green("Tweet saved!"));
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

console.log(searchString);

// Begin watching for matching tweets.
const stream = twitterClient.stream("statuses/filter", {
  track: searchString
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
