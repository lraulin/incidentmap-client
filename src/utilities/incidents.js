const createIncidentType = (id, displayName, searchString, crisisType) => ({
  id,
  displayName,
  searchString,
  crisisType,
  regex: reify(searchString)
});

function reify(str) {
  str = str
    .toLowerCase()
    .replace(/%26 |\(|\)/g, "")
    .split("|")
    .map(str =>
      str
        .split(" ")
        .map(word => "(?=.*" + word + ")")
        .join("")
    )
    .join("|");
  str = "^" + str + ".*$";
  return new RegExp(str, "i");
}

const incidentTypes = [
  createIncidentType(
    "fatalCrash",
    "Fatal Crash",
    "(fatal %26 crash)|(fatal %26 car %26 crash)|(fatal %26 car %26 accident)|(Pedestrian %26 killed)|(Fatal %26 truck %26 accident)|" +
      "(Fatal %26 truck %26 crash)|(Truck %26 kill)|(Bus %26 kill)|(Cyclist %26 killed)|(Bicyclist %26 killed)",
    "HIGHWAY"
  ),
  createIncidentType(
    "pedestrianCrash",
    "Pedestrian Crash",
    "(Pedestrian %26 crash)|(Pedestrian %26 killed)",
    "HIGHWAY"
  ),
  createIncidentType(
    "cyclistCrash",
    "Cyclist Crash",
    "(Bicyclist %26 crash)|(Bicyclist %26 killed)|(Cyclist %26 crash)|(Cyclist %26 killed)",
    "HIGHWAY"
  ),
  createIncidentType(
    "truckCrash",
    "Truck Crash",
    "(Truck %26 crash)|(Truck %26 kill)|(Fatal %26 truck %26 crash)|(Fatal %26 truck %26 accident)",
    "MOTORCARRIER"
  ),
  createIncidentType(
    "busCrash",
    "Bus Crash",
    "(Bus %26 crash)|(Bus %26 kill)",
    "MOTORCARRIER"
  ),
  createIncidentType(
    "transitCrash",
    "Transit Crash",
    "(Transit %26 Crash)|(Transit %26 crash)|(Transit %26 kill)",
    "TRANSIT"
  ),
  createIncidentType(
    "transSuicide",
    "Transportation-related Suicide",
    "(Rail %26 suicide)|(Transit %26 suicide)",
    "OTHER"
  ),
  createIncidentType(
    "pipeline",
    "Pipeline Incident",
    "(Pipeline %26 explosion)|(pipeline %26 spills)",
    "PIPELINE"
  ),
  createIncidentType(
    "hazmat",
    "HAZMAT Incident",
    "(Hazardous %26 spill)|(Hazardous %26 spills)",
    "NONE"
  ),
  createIncidentType(
    "rail",
    "Rail Incident",
    "(Train %26 explosion)|(Train %26 explode)",
    "RAIL"
  ),
  createIncidentType(
    "road",
    "Road Hazard or Closure",
    "(Bike %26 lane %26 blocked)|(Bus %26 lane %26 blocked)|(road %26 closed)|(road %26 closure)|(road %26 flooded)|(road %26 washed)|(bridge %26 closed)|(bridge %26 out)",
    "HIGHWAY"
  ),
  createIncidentType(
    "unsafe",
    "Unsafe Behavior",
    "(ran %26 red %26 light)|(blew %26 red %26 light)|(blew %26 through %26 red %26 light)",
    "HIGHWAY"
  ),
  createIncidentType(
    "drone",
    "Drone Incident",
    "(Drone %26 unauthorized)",
    "NONE"
  )
];

export const incidentDictionary = {};
incidentTypes.forEach(x => (incidentDictionary[x.id] = x));

export default incidentTypes;
