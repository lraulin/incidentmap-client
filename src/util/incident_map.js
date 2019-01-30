import secrets from "../data/secrets";
import MarkerClusterer from "@google/markerclusterer";
import React from "react";
import ReactDOM from "react-dom";
import InfoWindow from "../components/InfoWindow";
import stampit from "stampit";

const GoogleMap = stampit({
  props: {
    apiKey: null,
    center: {
      lat: 39.8283,
      lng: -98.5795
    },
    zoom: 4,
    divName: "map",
    map: null
  },
  init({
    apiKey,
    lat = this.center.lat,
    lng = this.center.lng,
    zoom = this.zoom,
    divName = this.divName
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
        script.src = `https://maps.google.com/maps/api/js?key=${
          secrets.googleMapsApiKey
        }`;
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
        zoom: this.zoom
      });
    }
  }
});

const WithMarkerClusterer = stampit({
  props: {
    markers: [],
    clusterer: null
  },
  init({ tweets = null }) {
    if (tweets && tweets.length) {
      this.updateMarkers(tweets);
    }
  },
  methods: {
    addMarker(lat, lng) {
      const marker = new window.google.maps.Marker({
        position: { lat, lng }
      });
      this.markers.push(marker);
      return marker;
    }
  }
});

const TweetMarkers = stampit({
  methods: {
    addInfoWindow(marker, tweet) {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div id="infoWindow${tweet.id_str}" />`
      });
      infoWindow.addListener("domready", e =>
        ReactDOM.render(
          <InfoWindow tweet={tweet} />,
          document.getElementById(`infoWindow${tweet.id_str}`)
        )
      );
      marker.addListener("click", () => {
        if (this.lastInfoWindow) this.lastInfoWindow.close();
        infoWindow.open(this.map, marker);
        this.lastInfoWindow = infoWindow;
      });
    },
    updateMarkers(tweets) {
      if (window.google && this.map) {
        // remove previous markers, if any
        if (this.markers.length && this.clusterer) {
          this.clusterer.clearMarkers();
        }

        // Add some markers to the map.
        // Ternary operator produces empty list if length is 0, otherwise array of
        // markers.
        tweets.forEach(tweet => {
          if ("coordinates" in tweet) {
            this.addInfoWindow(
              this.addMarker(
                tweet.coordinates.Latitude,
                tweet.coordinates.Longitude
              ),
              tweet
            );
          }
        });
        // Add a marker clusterer to manage the markers, if it doesn't exist.
        if (!this.clusterer) {
          this.clusterer = new MarkerClusterer(this.map, this.markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
          });
          this.clusterer.addMarkers(this.markers);
        } else {
          this.clusterer.addMarkers(this.markers);
        }
      } else {
        setTimeout(() => this.updateMarkers(tweets), 500);
      }
    }
  }
});

const createIncidentMap = stampit.compose(
  GoogleMap,
  WithMarkerClusterer,
  TweetMarkers
);

export default createIncidentMap;
