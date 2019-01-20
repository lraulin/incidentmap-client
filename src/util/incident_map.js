import secrets from "../data/secrets";
import MarkerClusterer from "@google/markerclusterer";
import React from "react";
import ReactDOM from "react-dom";
import InfoWindow from "../components/InfoWindow";

const createIncidentMap = () => ({
  map: null,
  markers: null,
  markerCluster: null,
  lastInfoWindow: null,
  options: {
    center: {
      lat: 39.8283,
      lng: -98.5795
    },
    zoom: 4
  },
  onScriptLoad() {
    const div = document.getElementById("myMap");
    this.map = new window.google.maps.Map(div, this.options);
    console.log("Map ready");
  },
  initMap() {
    if (!window.google) {
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://maps.google.com/maps/api/js?key=${
        secrets.googleMapsApiKey
      }`;
      const scripts = document.getElementsByTagName("script");
      const x = scripts[scripts.length - 1];
      x.parentNode.appendChild(s);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      s.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  },
  updateMarkers(tweets) {
    if (window.google && this.map) {
      // remove previous markers, if any
      if (this.markers) {
        this.markerCluster.clearMarkers();
      }

      // Add some markers to the map.
      // Ternary operator produces empty list if length is 0, otherwise array of
      // markers.
      this.markers = tweets
        ? tweets.map((tweet, i) => {
            let marker = null;
            if ("coordinates" in tweet) {
              marker = new window.google.maps.Marker({
                position: {
                  lat: tweet.coordinates.Latitude,
                  lng: tweet.coordinates.Longitude
                }
              });
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
            }
            return marker;
          })
        : [];

      // Add a marker clusterer to manage the markers, if it doesn't exist.
      if (!this.markerCluster) {
        this.markerCluster = new MarkerClusterer(this.map, this.markers, {
          imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
        this.markerCluster.addMarkers(this.markers);
      } else {
        this.markerCluster.addMarkers(this.markers);
      }
    } else {
      setTimeout(() => this.updateMarkers(tweets), 500);
    }
  }
});

export default createIncidentMap;
