import React, { useState, useEffect } from "react";
import createIncidentMap from "../incident_map";

const Map = ({ filteredTweets, ...props }) => {
  const [initialized, setInitialized] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!initialized) {
      const map = createIncidentMap();
      map.initMap();
      setMap(map);
      setInitialized(true);
    }
  });

  useEffect(
    () => {
      if (window.google && map) {
        map.updateMarkers(filteredTweets);
      }
    },
    [filteredTweets]
  );

  return <div style={{ height: "100vh", width: "100%" }} id="myMap" />;
};

export default Map;
