import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import { getData } from "../danDb";

// [lng, lat]
const GEOGRAPHIC_CENTER_OF_US = [-98.5795, 39.8283];

const onMapLoad = map => data => {
  // Add a new source from our GeoJSON data and set the
  // 'cluster' option to true. GL-JS will add the point_count property to your source data.
  map.addSource("tweets", {
    type: "geojson",
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: {
      type: "FeatureCollection",
      features: data,
    },
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
};

const initMap = container => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  const map = new mapboxgl.Map({
    container,
    style: "mapbox://styles/mapbox/streets-v9",
    center: GEOGRAPHIC_CENTER_OF_US,
    zoom: 2,
    minZoom: 2,
    maxZoom: 8,
  });

  map.on("load", () => {
    getData(onMapLoad(map));
  });

  return map;
};

const baseStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "100%",
};

const mapStateToProps = state => ({
  filterSettings: {
    text: state.filterSettings.text,
    startDate: state.filterSettings.startDate,
    endDate: state.filterSettings.endDate,
    incidentTypes: {
      fatalCrash: state.filterSettings.incidentTypes.fatalCrash,
      pedestrianCrash: state.filterSettings.incidentTypes.pedestrianCrash,
      cyclistCrash: state.filterSettings.incidentTypes.cyclistCrash,
      truckCrash: state.filterSettings.incidentTypes.truckCrash,
      busCrash: state.filterSettings.incidentTypes.busCrash,
      transitCrash: state.filterSettings.incidentTypes.transitCrash,
      transSuicide: state.filterSettings.incidentTypes.transSuicide,
      pipeline: state.filterSettings.incidentTypes.pipeline,
      hazmat: state.filterSettings.incidentTypes.hazmat,
      rail: state.filterSettings.incidentTypes.rail,
      road: state.filterSettings.incidentTypes.road,
      unsafe: state.filterSettings.incidentTypes.unsafe,
      drone: state.filterSettings.incidentTypes.drone,
    },
  },
  incidentTypeList: Object.keys(state.filterSettings.incidentTypes),
});

const DotMap = ({ filterSettings, hidden }) => {
  const mapContainer = useRef();
  const map = useRef();
  const style = hidden ? { ...baseStyle, display: "none" } : baseStyle;

  // componentDidMount
  useEffect(() => {
    if (!map.current) {
      getData(data => {
        console.log(data);
        map.current = initMap(mapContainer.current, data);
      }, filterSettings);
    }
  }, []);

  // componentDidUpdate
  useEffect(() => {
    if (map.current) {
      getData(data => {
        map.current
          .getSource("tweets")
          .setData({ type: "FeatureCollection", features: data });
      }, filterSettings);
    }
  });

  // componentWillUnmount
  useEffect(
    () => () => {
      if (map.current) {
        map.current.remove();
      }
    },
    [],
  );

  return <div style={style} ref={mapContainer} />;
};

export default connect(
  mapStateToProps,
  null,
)(DotMap);
