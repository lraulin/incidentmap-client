import MarkerClusterer from "@google/markerclustererplus";
import React from "react";
import ReactDOM from "react-dom";
import InfoWindow from "./components/InfoWindow";
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
let currentInfoWindow = null;

const onClickMarker = tweetId => store.dispatch(setSelectedMarkers([tweetId]));

const onClickClusterMarker = (tweetIds = []) =>
  store.dispatch(setSelectedMarkers(tweetIds));

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

// Add marker to map
const addMarker = (lat, lng) => {
  const marker = new window.google.maps.Marker({
    position: { lat, lng },
  });
  markers.push(marker);
  return marker;
};

// Create infowindow showing tweet for each marker with listener to open on click
const addInfoWindow = marker => {
  const infoWindow = new window.google.maps.InfoWindow({
    content: `<div id="infoWindow${marker.tweetId}" />`,
  });
  infoWindow.addListener("domready", e =>
    ReactDOM.render(
      <InfoWindow tweetIds={[marker.tweetId]} />,
      document.getElementById(`infoWindow${marker.tweetId}`),
    ),
  );
  marker.addListener("click", () => {
    onClickMarker(marker.tweetId);
    if (currentInfoWindow) currentInfoWindow.close();
    infoWindow.open(googleMap, marker);
    currentInfoWindow = infoWindow;
  });
};

// Create infowindow for cluster marker showing all tweets in cluster
const addClusterWindow = cluster => {
  // Create unique id for cluster by combining lat & lng
  const id = "L" + cluster.getCenter().lat() + "G" + cluster.getCenter().lng();

  // Create the infowindow
  const infoWindow = new window.google.maps.InfoWindow({
    content: `<div id="infoWindow${id}" />`,
  });

  // Get tweets in cluster
  const tweetIds = cluster.getMarkers().map(marker => marker.tweetId);

  // Render the infowindow
  infoWindow.addListener("domready", e =>
    ReactDOM.render(
      <InfoWindow tweetIds={tweetIds} />,
      document.getElementById(`infoWindow${id}`),
    ),
  );

  return infoWindow;
};

// Create markers on map for all currently visible tweets
export const updateMarkers = (visibleTweetIds, tweetDict) => {
  // Close infowindow if one is open
  if (currentInfoWindow) currentInfoWindow.close();

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

    visibleTweetIds.forEach(id => {
      const tweet = tweetDict[id];
      if ("coordinates" in tweet) {
        const marker = addMarker(
          tweet.coordinates.Latitude,
          tweet.coordinates.Longitude,
        );
        marker.tweetId = id;
        addInfoWindow(marker);
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
      onClickClusterMarker(tweetIds);
      if (currentInfoWindow) currentInfoWindow.close();
      currentInfoWindow = addClusterWindow(cluster);
      currentInfoWindow.open(googleMap);
    });
  } else {
    setTimeout(() => updateMarkers(visibleTweetIds, tweetDict), 500);
  }
};
