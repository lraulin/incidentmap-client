import React, { Component } from "react";
import { render } from "react-dom";
import secrets from "../secrets";
import MarkerClusterer from "@google/markerclusterer";
import InfoWindow from "./InfoWindow";

const geographicCenterOfUSA = {
  lat: 39.8283,
  lng: -98.5795
};

class Map extends Component {
  state = {
    id: "myMap",
    options: {
      center: geographicCenterOfUSA,
      zoom: 4
    },
    map: null
  };
  markers = [];
  markerCluster = null;
  onScriptLoad = this.onScriptLoad.bind(this);
  setMarkers = this.setMarkers.bind(this);
  lastInfoWindow = null;
  initialized = false;

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.state.id),
      this.state.options
    );
    this.setState({ map });
  }

  setMarkers() {
    // remove previous markers, if any
    if (this.markers.length) {
      //this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      this.markerCluster.clearMarkers();
    }

    // Add some markers to the map.
    // Ternary operator produces empty list if length is 0, otherwise array of
    // markers.
    this.markers = this.props.filteredTweets
      ? this.props.filteredTweets.map((tweet, i) => {
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
              render(
                <InfoWindow tweet={tweet} />,
                document.getElementById(`infoWindow${tweet.id_str}`)
              )
            );
            marker.addListener("click", () => {
              if (this.lastInfoWindow) this.lastInfoWindow.close();
              this.lastInfoWindow = infoWindow;
              infoWindow.open(this.map, marker);
            });
          }
          return marker;
        })
      : [];

    // Add a marker clusterer to manage the markers, if it doesn't exist.
    if (!this.markerCluster) {
      this.markerCluster = new MarkerClusterer(this.state.map, this.markers, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
      });
    } else {
      this.markerCluster.addMarkers(this.markers);
    }
  }

  componentDidMount() {
    if (!this.initialized) {
      if (!window.google) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = `https://maps.google.com/maps/api/js?key=${
          secrets.googleMapsApiKey
        }`;
        var x = document.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
        // Below is important.
        //We cannot access google.maps until it's finished loading
        s.addEventListener("load", e => {
          this.onScriptLoad();
        });
      } else {
        this.onScriptLoad();
      }
      this.initialized = true;
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.filteredTweets !== prevProps.filteredTweets &&
      window.google
    ) {
      this.setMarkers();
    }
  }

  render() {
    return (
      <div style={{ height: "100vh", width: "100%" }} id={this.state.id} />
    );
  }
}

export default Map;
