import MarkerClusterer from "@google/markerclustererplus";
import React from "react";
import ReactDOM from "react-dom";
import store from "./redux/store";
import { setSelectedMarkers } from "./redux/actions";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Constants
const divName = "map";
const defaultMapOptions = {
  center: {
    lat: 39.8283,
    lng: -98.5795,
  },
  zoom: 4,
};

// Module instance variables
let markers = [];
let googleMap = null;
let clusterer = null;

// Load map when DOM is ready
const onScriptLoad = () => {
  const div = document.getElementById(divName);
  googleMap = new window.google.maps.Map(div, defaultMapOptions);
};

// Add script to map with listener to load map when ready
if (window.google) {
  onScriptLoad();
} else {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `https://maps.google.com/maps/api/js?key=${googleMapsApiKey}`;
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(script);
  script.addEventListener("load", e => {
    onScriptLoad();
  });
}

// Create markers on map for all currently visible tweets
export const updateMarkers = (visibleTweetIds, tweetDict) => {
  console.log(`Adding ${visibleTweetIds.length} tweets to the map`);
  if (window.google && googleMap) {
    // remove previous markers, if any
    if (clusterer) clusterer.clearMarkers();
    if (markers.length) {
      markers.forEach(marker => marker.setMap(null));
      markers = [];
    }

    // Now that the map is cleared, if there are no tweets to add, we are done.
    if (visibleTweetIds.length === 0) return;

    // Add a marker for each visible Tweet
    visibleTweetIds.forEach(id => {
      if ("coordinates" in tweetDict[id]) {
        const marker = new window.google.maps.Marker({
          position: {
            lat: tweetDict[id].coordinates.Latitude,
            lng: tweetDict[id].coordinates.Longitude,
          },
        });
        // Assign tweetId to marker
        marker.tweetId = id;
        // Add an event listener for marker clicks
        marker.addListener("click", () =>
          store.dispatch(setSelectedMarkers([marker.tweetId])),
        );
        // Add marker reference to markers collection
        markers.push(marker);
      }
    });

    // Add a marker clusterer to manage the markers, if it doesn't exist.
    if (!clusterer) {
      clusterer = new MarkerClusterer(googleMap, markers, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        zoomOnClick: false,
      });
      clusterer.addMarkers(markers);
    } else {
      clusterer.addMarkers(markers);
    }

    // add event listener to show window when clicking on markers
    window.google.maps.event.addListener(clusterer, "clusterclick", cluster => {
      // Get tweets in cluster
      const tweetIds = cluster.getMarkers().map(marker => marker.tweetId);
      store.dispatch(setSelectedMarkers(tweetIds));
    });
  } else {
    setTimeout(() => updateMarkers(visibleTweetIds, tweetDict), 500);
  }
};
