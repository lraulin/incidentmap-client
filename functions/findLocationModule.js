const axios = require("axios");
const { googleMapsApiKey } = require("./secrets.js");
const { writeToFile } = require("./utils.js");

module.exports = (() => {
  const getGoogleMapsApiUrl = location =>
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${googleMapsApiKey}`;

  // returns promise that resolves to {Latitude, Longitude} for location string
  const geocode = async location => {
    const apiUrl = getGoogleMapsApiUrl(location);
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
          writeToFile(res.toString(), "./geocoding.log");
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
  return async tweet => {
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
        console.log(tweet.coordinates);
        throw new TypeError("coordinates object has incorrect properties");
      }
    }
  };
})();
