import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import tweetGeoJson from "../tweets.geojson";

const initMap = container => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  const map = new mapboxgl.Map({
    container,
    style: "mapbox://styles/mapbox/streets-v9",
  });

  map.on("load", function() {
    // Add a new source from our GeoJSON data and set the
    // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    map.addSource("tweets", {
      type: "geojson",
      // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: tweetGeoJson,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "tweets",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "tweets",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "tweets",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // inspect a cluster on click
    map.on("click", "clusters", function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      var clusterId = features[0].properties.cluster_id;
      map
        .getSource("tweets")
        .getClusterExpansionZoom(clusterId, function(err, zoom) {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    map.on("mouseenter", "clusters", function() {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", function() {
      map.getCanvas().style.cursor = "";
    });
  });

  return map;
};

const style = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "100%",
};

const DotMap = () => {
  const mapContainer = useRef();
  const map = useRef();

  // componentDidMount
  useEffect(() => {
    map.current = initMap(mapContainer.current);
  }, []);

  // componentWillUnmount
  useEffect(
    () => () => {
      map.current.remove();
    },
    [],
  );

  return <div style={style} ref={mapContainer} />;
};

export default DotMap;
