#!/usr/bin/env node

const incidentTypes = require("./incidentTypes.js");
const serviceAccount = require("./firebase/incident-report-map-firebase-adminsdk-rx0ey-6ec9058686.json");
const {
  googleMapsApiKey,
  twitterConfig,
  postgresConfig
} = require("./secrets.js");
const Twitter = require("twitter");
const axios = require("axios");
const colors = require("colors");
const { writeToFile } = require("./utils.js");
const stampit = require("@stamp/it");
const Required = require("@stamp/required");
const postgresModule = require("./postgres/postgresModule.js");

const databaseURL = "https://incident-report-map.firebaseio.com";
let searchString =
  "fatal crash,fatal car crash,fatal car accident,pedestrian killed,fatal truck accident,fatal truck crash,truck kill,bus kill,cyclist killed,bicyclist killed,pedestrian crash,pedestrian killed,bicyclist crash,bicyclist killed,cyclist crash,cyclist killed,truck crash,truck kill,fatal truck crash,fatal truck accident,bus crash,bus kill,transit crash,transit crash,transit kill,rail suicide,transit suicide,pipeline explosion,pipeline spills,hazardous spill,hazardous spills,train explosion,train explode,bike lane blocked,bus lane blocked,road closed,road closure,road flooded,road washed,bridge closed,bridge out,ran red light,blew red light,blew through red light,drone unauthorized";

const createTwitter = stampit({
  props: {
    twitterClient: null
  },
  init({ twitterConfig }) {
    this.twitterClient = new Twitter(twitterConfig);
  }
});

const hasGeocoder = stampit({
  props: {
    googleMapsApiKey: null
  },
  init({ googleMapsApiKey }) {
    this.googleMapsApiKey = googleMapsApiKey;
  },
  methods: {
    getGoogleMapsApiUrl(location) {
      return `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${this.googleMapsApiKey}`;
    },
    // returns promise that resolves to {Latitude, Longitude} for location string
    async geocode(location) {
      const apiUrl = this.getGoogleMapsApiUrl(location);
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
            console.log(res);
            writeToFile(res, "geocoding.log");
            return null;
          }
        })
        .catch(e => {
          console.log(e.toString().red);
          console.log("Unfound Location " + location);
        });
    },
    /**
     * Attempt to set tweet coordinates based on user location if geo data is not
     * avalable and return reference to Tweet. Throw error if Tweet is malformed.
     * */
    async localizeTweet(tweet) {
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
        return { ...tweet, coordinates: await this.geocode(location) };
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
    }
  }
});

const hasTweetStreamer = stampit({
  props: {
    searchString: null
  },
  init({ searchString }) {
    this.searchString = searchString;
    this.start();
  },
  methods: {
    categorize(tweet) {
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
    },
    async processTweetStream(data) {
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
        this.categorize(data);
        data = await this.localizeTweet(data);
        if (!data.coordinates) {
          if (data.user && data.user.location)
            console.log(
              `Geocoding for ${data.user.location} failed. Discarding Tweet.`
                .yellow
            );
          else console.log("Geolocation failed. Discarding Tweet.".yellow);
          return;
        }
        this.saveTweet(data);
      }
    },
    start() {
      const stream = this.twitterClient.stream("statuses/filter", {
        track: this.searchString
      });

      stream.on("data", event => {
        console.log(event && event.text);

        if (event.id_str) {
          this.processTweetStream(event);
        }
      });

      stream.on("error", error => {
        throw error;
      });
    }
  }
}).compose(Required.required({ methods: { saveTweet: Required } }));

const createIncidentTweetStreamer = stampit(
  createTwitter,
  postgresModule,
  hasGeocoder,
  hasTweetStreamer
);

createIncidentTweetStreamer({
  serviceAccount,
  googleMapsApiKey,
  searchString,
  twitterConfig,
  databaseURL,
  ...postgresConfig
});
