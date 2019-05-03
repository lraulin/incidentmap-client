export const crisisTypes = {
  "0": "HIGHWAY",
  "1": "MOTORCARRIER",
  "2": "TRANSIT",
  "3": "RAIL",
  "4": "OTHER",
  "5": "PIPELINE",
  "6": "NONE",
  HIGHWAY: 0,
  MOTORCARRIER: 1,
  TRANSIT: 2,
  RAIL: 3,
  OTHER: 4,
  PIPELINE: 5,
  NONE: 6,
};

export const incidentTypes = [
  {
    id: "fatalCrash",
    displayName: "Fatal Crash",
    searchString:
      "(fatal %26 crash)|(fatal %26 car %26 crash)|(fatal %26 car %26 accident)|(Pedestrian %26 killed)|(Fatal %26 truck %26 accident)|(Fatal %26 truck %26 crash)|(Truck %26 kill)|(Bus %26 kill)|(Cyclist %26 killed)|(Bicyclist %26 killed)",
    crisisType: 0,
  },
  {
    id: "pedestrianCrash",
    displayName: "Pedestrian Crash",
    searchString: "(Pedestrian %26 crash)|(Pedestrian %26 killed)",
    crisisType: 0,
  },
  {
    id: "cyclistCrash",
    displayName: "Cyclist Crash",
    searchString:
      "(Bicyclist %26 crash)|(Bicyclist %26 killed)|(Cyclist %26 crash)|(Cyclist %26 killed)",
    crisisType: 0,
  },
  {
    id: "truckCrash",
    displayName: "Truck Crash",
    searchString:
      "(Truck %26 crash)|(Truck %26 kill)|(Fatal %26 truck %26 crash)|(Fatal %26 truck %26 accident)",
    crisisType: 1,
  },
  {
    id: "busCrash",
    displayName: "Bus Crash",
    searchString: "(Bus %26 crash)|(Bus %26 kill)",
    crisisType: 1,
  },
  {
    id: "transitCrash",
    displayName: "Transit Crash",
    searchString: "(Transit %26 Crash)|(Transit %26 crash)|(Transit %26 kill)",
    crisisType: 2,
  },
  {
    id: "transSuicide",
    displayName: "Transportation-related Suicide",
    searchString: "(Rail %26 suicide)|(Transit %26 suicide)",
    crisisType: 4,
  },
  {
    id: "pipeline",
    displayName: "Pipeline Incident",
    searchString: "(Pipeline %26 explosion)|(pipeline %26 spills)",
    crisisType: 5,
  },
  {
    id: "hazmat",
    displayName: "HAZMAT Incident",
    searchString: "(Hazardous %26 spill)|(Hazardous %26 spills)",
    crisisType: 6,
  },
  {
    id: "rail",
    displayName: "Rail Incident",
    searchString: "(Train %26 explosion)|(Train %26 explode)",
    crisisType: 3,
  },
  {
    id: "road",
    displayName: "Road Hazard or Closure",
    searchString:
      "(Bike %26 lane %26 blocked)|(Bus %26 lane %26 blocked)|(road %26 closed)|(road %26 closure)|(road %26 flooded)|(road %26 washed)|(bridge %26 closed)|(bridge %26 out)",
    crisisType: 0,
  },
  {
    id: "unsafe",
    displayName: "Unsafe Behavior",
    searchString:
      "(ran %26 red %26 light)|(blew %26 red %26 light)|(blew %26 through %26 red %26 light)",
    crisisType: 0,
  },
  {
    id: "drone",
    displayName: "Drone Incident",
    searchString: "(Drone %26 unauthorized)",
    crisisType: 6,
  },
];
