import secrets from "./secrets";
import MarkerClusterer from "@google/markerclusterer";
import React from "react";
import ReactDOM from "react-dom";
import InfoWindow from "./components/InfoWindow";

const createIncidentMap = () => {
  let map, markers, markerCluster, lastInfoWindow;
  const options = {
    center: {
      lat: 39.8283,
      lng: -98.5795
    },
    zoom: 4
  };

  return {
    onScriptLoad() {
      const div = document.getElementById("myMap");
      map = new window.google.maps.Map(div, options);
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
        console.log("script added. listening for load");
        s.addEventListener("load", e => {
          this.onScriptLoad();
        });
      } else {
        this.onScriptLoad();
      }
    },
    updateMarkers(tweets) {
      if (window.google && map) {
        // remove previous markers, if any
        if (markers) {
          markerCluster.clearMarkers();
        }

        // Add some markers to the map.
        // Ternary operator produces empty list if length is 0, otherwise array of
        // markers.
        markers = tweets
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
                  if (lastInfoWindow) lastInfoWindow.close();
                  infoWindow.open(map, marker);
                  lastInfoWindow = infoWindow;
                });
              }
              return marker;
            })
          : [];

        // Add a marker clusterer to manage the markers, if it doesn't exist.
        if (!markerCluster) {
          markerCluster = new MarkerClusterer(map, markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
          });
          markerCluster.addMarkers(markers);
        } else {
          markerCluster.addMarkers(markers);
        }
      } else {
        setTimeout(() => this.updateMarkers(tweets), 500);
      }
    }
  };
};

export default createIncidentMap;
