import { googleMapsApiKey } from "./secrets";
import MarkerClusterer from "@google/markerclustererplus";
import React from "react";
import ReactDOM from "react-dom";
import InfoWindow from "./components/InfoWindow";
import stampit from "@stamp/it";

const GoogleMap = stampit({
  props: {
    apiKey: null,
    center: {
      lat: 39.8283,
      lng: -98.5795,
    },
    zoom: 4,
    divName: "map",
    map: null,
  },
  init({
    apiKey,
    lat = this.center.lat,
    lng = this.center.lng,
    zoom = this.zoom,
    divName = this.divName,
  }) {
    this.apiKey = apiKey;
    this.center.lat = lat;
    this.center.lng = lng;
    this.zoom = zoom;
    this.divName = divName;
  },
  methods: {
    initMap() {
      if (window.google) {
        this.onScriptLoad();
      } else {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://maps.google.com/maps/api/js?key=${googleMapsApiKey}`;
        const body = document.getElementsByTagName("body")[0];
        body.appendChild(script);
        script.addEventListener("load", e => {
          this.onScriptLoad();
        });
      }
    },
    onScriptLoad() {
      const div = document.getElementById(this.divName);
      this.map = new window.google.maps.Map(div, {
        center: this.center,
        zoom: this.zoom,
      });
    },
  },
});

const WithMarkerClusterer = stampit({
  props: {
    markers: [],
    clusterer: null,
  },
  init({ tweets = null }) {
    if (tweets && tweets.length) {
      this.updateMarkers(tweets);
    }
  },
  methods: {
    addMarker(lat, lng) {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
      });
      this.markers.push(marker);
      return marker;
    },
  },
});

const TweetMarkers = stampit({
  methods: {
    addInfoWindow(marker) {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div id="infoWindow${marker.tweet.id_str}" />`,
      });
      infoWindow.addListener("domready", e =>
        ReactDOM.render(
          <InfoWindow tweets={[marker.tweet]} />,
          document.getElementById(`infoWindow${marker.tweet.id_str}`),
        ),
      );
      marker.addListener("click", () => {
        if (this.lastInfoWindow) this.lastInfoWindow.close();
        infoWindow.open(this.map, marker);
        this.lastInfoWindow = infoWindow;
      });
    },
    addClusterWindow(cluster) {
      // Create unique id for cluster by combining lat & lng
      const id =
        "L" + cluster.getCenter().lat() + "G" + cluster.getCenter().lng();
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div id="infoWindow${id}" />`,
      });
      console.log(cluster);
      const tweets = cluster.getMarkers().map(marker => marker.tweet);
      infoWindow.addListener("domready", e =>
        ReactDOM.render(
          <InfoWindow tweets={tweets} />,
          document.getElementById(`infoWindow${id}`),
        ),
      );
      return infoWindow;
    },
    updateMarkers(tweets) {
      console.log(`Adding ${tweets.length} tweets to the map`);
      if (window.google && this.map) {
        // remove previous markers, if any
        if (this.clusterer) this.clusterer.clearMarkers();
        if (this.markers.length) {
          this.markers.forEach(marker => marker.setMap(null));
          this.markers = [];
        }

        // Now that the map is cleared, if there are no tweets to add, we are done.
        if (tweets.length === 0) return;

        tweets.forEach(tweet => {
          if ("coordinates" in tweet) {
            const marker = this.addMarker(
              tweet.coordinates.Latitude,
              tweet.coordinates.Longitude,
            );
            marker.tweet = tweet;
            this.addInfoWindow(marker);
          }
        });

        // Add a marker clusterer to manage the markers, if it doesn't exist.
        if (!this.clusterer) {
          this.clusterer = new MarkerClusterer(this.map, this.markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            zoomOnClick: false,
          });
          this.clusterer.addMarkers(this.markers);
        } else {
          this.clusterer.addMarkers(this.markers);
        }

        // add event listener to show window when clicking on markers
        window.google.maps.event.addListener(
          this.clusterer,
          "clusterclick",
          cluster => {
            if (this.lastInfoWindow) this.lastInfoWindow.close();
            this.infoWindow = this.addClusterWindow(cluster);
            this.infoWindow.open(this.map);
          },
        );
      } else {
        setTimeout(() => this.updateMarkers(tweets), 500);
      }
    },
  },
});

const createIncidentMap = stampit.compose(
  GoogleMap,
  WithMarkerClusterer,
  TweetMarkers,
);

export default createIncidentMap;
