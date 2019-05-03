import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import L from "leaflet";
import "leaflet.markercluster";
import { formatDate } from "./utils";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

// Constants
const divName = "map";

const allData = [];

const BootstrapExt = {
  warning(message) {
    document.body.insertAdjacentHTML(
      "beforeend",
      [
        '<div class="alert alert-warning" role="alert">',
        '<a class="close" data-dismiss="alert">×</a>',
        "<strong>Warning:</strong> " + message,
      ].join(""),
    );
  },
};

function saveText(text, filename) {
  var a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/plain;charset=utf-u," + encodeURIComponent(text),
  );
  a.setAttribute("download", filename);
  a.click();
}

const crisisTypes = {
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

const incidentTypes = [
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

const groupOptions = {
  spiderfyOnMaxZoom: false,
  disableClusteringAtZoom: 17,
};

const myTweetMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisHwyMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisMotorCarrierMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisTransitMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisRailMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisOtherMarkers = new L.MarkerClusterGroup(groupOptions);
const myCrisisPipelineMarkers = new L.MarkerClusterGroup(groupOptions);

const layers = [
  { type: "all", layer: myTweetMarkers },
  { type: "all_crisis", layer: myCrisisMarkers },
  { type: "HIGHWAY", layer: myCrisisHwyMarkers },
  { type: "MOTORCARRIER", layer: myCrisisMotorCarrierMarkers },
  { type: "TRANSIT", layer: myCrisisTransitMarkers },
  { type: "RAIL", layer: myCrisisRailMarkers },
  { type: "OTHER", layer: myCrisisOtherMarkers },
  { type: "PIPELINE", layer: myCrisisPipelineMarkers },
];

const fetchAsync = async url => await (await fetch(url)).json();
const postAsync = async (url, data) =>
  await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

const postJsonServer = async data =>
  await postAsync("http://localhost:3001/incidentReports", data);

const create_DOT_Incident_Map = () => ({
  layers,
  baseApiUrl: "http://dotdb2.eastus.cloudapp.azure.com:8082/api/twitter/",
  incidentTypes,
  myMap: null,
  filterSettings: {},
  addAllMarkerLayers(
    data = [
      {
        created: 0,
        event_type: "",
        fatalities: 0,
        injuries: 0,
        latitude: 0,
        longitude: 0,
        type: "",
      },
    ],
  ) {
    this.myMap.addLayer(myTweetMarkers);
    this.myMap.addLayer(myCrisisMarkers);

    data.forEach(datum => {
      const lat = datum.latitude;
      const long = datum.longitude;
      if (lat && long) {
        if (datum.type && datum.type === "crisis") {
          const marker = L.marker(L.latLng(lat, long), {
            icon: L.mapbox.marker.icon({
              "marker-symbol": "hospital",
              "marker-color": "eb2f2f",
            }),
          });

          marker.on("click", event => {
            this.populateTweetList(
              event.latlng.lat,
              event.latlng.lng,
              "crisis",
            );
          });

          const crisisCategoryMarker = L.marker(L.latLng(lat, long), {
            icon: L.mapbox.marker.icon({
              "marker-symbol": "hospital",
              "marker-color": "eb2f2f",
            }),
          });

          crisisCategoryMarker.on("click", event => {
            this.populateTweetList(
              event.latlng.lat,
              event.latlng.lng,
              "crisis",
            );
          });

          myCrisisMarkers.addLayer(marker);

          switch (datum.event_type) {
            case crisisTypes[crisisTypes.HIGHWAY]:
              myCrisisHwyMarkers.addLayer(crisisCategoryMarker);
              break;
            case crisisTypes[crisisTypes.MOTORCARRIER]:
              myCrisisMotorCarrierMarkers.addLayer(crisisCategoryMarker);
              break;
            case crisisTypes[crisisTypes.PIPELINE]:
              myCrisisPipelineMarkers.addLayer(crisisCategoryMarker);
              break;
            case crisisTypes[crisisTypes.RAIL]:
              myCrisisRailMarkers.addLayer(crisisCategoryMarker);
              break;
            case crisisTypes[crisisTypes.TRANSIT]:
              myCrisisTransitMarkers.addLayer(crisisCategoryMarker);
              break;
          }
        } else {
          const marker = L.marker(L.latLng(lat, long), {
            icon: L.mapbox.marker.icon({
              "marker-symbol": "marker",
              "marker-color": "4f4fc4",
            }),
          });

          marker.on("click", event => {
            this.populateTweetList(
              event.latlng.lat,
              event.latlng.lng,
              "tweets",
            );
          });

          myTweetMarkers.addLayer(marker);
        }
      }
    });
  },
  addMarkerLayer(data, incidentId) {
    const groupOptions = {
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 17,
    };

    const myTweetMarkers = new L.MarkerClusterGroup(groupOptions);
    this.layers.push({ type: incidentId, layer: myTweetMarkers });

    data.forEach(datum => {
      const hasLatLong = o => !!o.latitude && !!o.longitude;
      if (hasLatLong(datum)) {
        const [lat, long] = [datum.latitude, datum.longitude];
        const el = document.createElement("div");
        el.className = "marker";
        const marker = mapboxgl
          .Marker(el)
          .setLngLat([long, lat])
          .addTo(this.myMap);
        // icon: L.mapbox.marker.icon({
        //   "marker-symbol": "marker",
        //   "marker-color": "4f4fc4",

        marker.on("click", event => {
          this.populateTweetList(event.latlng.lat, event.latlng.lng);
        });

        myTweetMarkers.addLayer(marker);
      }
    });
  },
  async initMap() {
    const url = this.baseApiUrl + "history";
    try {
      const data = await fetchAsync(url);
      if (data) {
        this.loadMap();
        this.loadLayers(true);
        this.addAllMarkerLayers(data);
      } else {
        BootstrapExt.warning("No geotagged tweets available");
      }
    } catch (e) {
      clearInterval(this.interval);
      BootstrapExt.warning("Error retrieving tweets " + e);
    }
  },
  async reloadMap() {
    const baseQuery = this.appendFromToDates("");
    const query = baseQuery + this.appendSearchText(baseQuery);
    this.layers = [];
    dotMap.myMap.remove();
    document.getElementById("tweetList").innerHTML = "";
    document.querySelectorAll("input[id$=IncidentsCkBx]").forEach(elem => {
      elem.checked = false;
    });
    document.getElementById("allIncidentsCkBx").checked = true;
    document.getElementById("twitterCkBx").checked = true;
    document.getElementById("crisisCkBx").checked = true;
    const url = this.baseApiUrl + "history" + query;
    try {
      const data = await fetchAsync(url);
      if (data) {
        allData.push(data);
        this.loadMap();
        this.loadLayers(false);
        this.addAllMarkerLayers(data);
      } else {
        BootstrapExt.warning("No geotagged tweets available");
      }
    } catch (e) {
      clearInterval(this.interval);
      BootstrapExt.warning("Error retrieving tweets " + e);
    }
  },
  appendFromToDates(query) {
    if (this.filterSettings && this.filterSettings.startDate) {
      const startDate = formatDate(this.filterSettings.startDate).split("/");
      query = query === "" ? "?" : query + "&";
      query =
        query +
        "from=%27" +
        startDate[2] +
        "-" +
        startDate[0] +
        "-" +
        startDate[1] +
        "%27";
    }
    if (this.filterSettings && this.filterSettings.endDate) {
      const endDate = formatDate(this.filterSettings.endDate).split("/");
      query = query === "" ? "?" : query + "&";
      query =
        query + "to=%27" + endDate[2] + "-" + endDate[0] + "-" + endDate[1];
      query = query + "T23:59:59%27";
    }
    return query;
  },
  appendSearchText(query) {
    const searchText = this.filterSettings && this.filterSettings.text;
    if (searchText) {
      query = query === "" ? "?" : query + "&";
      query = query + "search=" + searchText.replace(/\s/g, " %26 ");
    }
    return query;
  },
  loadMap() {
    clearInterval(this.interval);
  },
  async loadLayers(loadCheckboxes) {
    this.incidentTypes.forEach(async incident => {
      const url =
        this.baseApiUrl +
        "history" +
        this.appendFromToDates("?query=" + incident.searchString);
      console.log("incidentMap.js:loadLayers()");
      console.log(url);
      try {
        const data = await fetchAsync(url);
        console.log(data);
        if (data) {
          this.addMarkerLayer(data, incident.id);
          if (loadCheckboxes) {
            document
              .querySelectorAll("#" + incident.id + "IncidentsCkBx")
              .forEach(el =>
                el.addEventListener("change", e =>
                  this.updateCategoryLayers(e.currentTarget, incident.id),
                ),
              );
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  },
  removeLayer(layerType) {
    dotMap.layers.forEach(item => {
      if (layerType === "") {
        dotMap.myMap.removeLayer(item.layer);
      } else if (item.type === layerType) {
        dotMap.myMap.removeLayer(item.layer);
      }
    });
  },
  updateCategoryLayers(item = new HTMLElement(), type = "") {
    if (item.checked) {
      if (document.getElementById("allIncidentsCkBx").checked) {
        dotMap.removeLayer("");
        document.getElementById("allIncidentsCkBx").checked = false;
      }
      dotMap.layers.forEach(item => {
        if (
          item.type === type &&
          document.getElementById("twitterCkBx").checked
        ) {
          item.layer.addTo(dotMap.myMap);
        }
        if (
          item.type === this.getCrisisType(type) &&
          document.getElementById("crisisCkBx").checked
        ) {
          item.layer.addTo(dotMap.myMap);
        }
      });
    } else {
      dotMap.layers.forEach(item => {
        if (item.type === type) {
          dotMap.myMap.removeLayer(item.layer);
        }
        if (item.type === this.getCrisisType(type)) {
          dotMap.myMap.removeLayer(item.layer);
        }
      });
    }
  },
  getCrisisType(tweetType) {
    incidentTypes.forEach(type => {
      if (type.id === tweetType) {
        return crisisTypes[type.crisisType];
      }
    });
    return crisisTypes[crisisTypes.NONE];
  },
  async populateTweetList(lat, lng, type) {
    let apiURL;
    document.getElementById("tweetList").innerHTML = "";
    if (type === "crisis") {
      apiURL = this.baseApiUrl + "crisis";
    } else {
      apiURL = this.baseApiUrl + "history";
    }
    document.getElementById("incidentProgress").style.display = "block";
    let query = "?lat=" + lat + "&lng=" + lng;
    query = this.appendFromToDates(query);
    query = this.appendSearchText(query);
    const url = apiURL + query;
    console.log(url);
    try {
      document.getElementById("incidentProgress").style.display = "none";
      const data = await fetchAsync(url);
      if (data) {
        data.forEach(datum => {
          const date = new Date(datum.created).toString();
          const created = date.indexOf("1970") > 0 ? "" : date;
          const index = created.indexOf("GMT");
          let userTxt = void 0;
          if (datum.type === "crisis") {
            document
              .getElementById("tweetList")
              .insertAdjacentHTML(
                "beforeend",
                [
                  '<li class="list-group-item">',
                  '<p class="tweet-user">' +
                    datum.user_id +
                    '<img class="icon-img" src="images/red_marker.png"/></p>',
                  datum.description +
                    " (fatalities: " +
                    datum.fatalities +
                    ", injuries: " +
                    datum.injuries +
                    ")",
                  '<br/><p class="tweet-timestamp">' +
                    (index > 0 ? created.substring(0, index) : created) +
                    "</p></li>",
                ].join(""),
              );
          } else if (datum.user_id) {
            userTxt = '<p class="tweet-user"><a href="https://twitter.com/';
            userTxt =
              userTxt + datum.user_id + '" target="_blank">@' + datum.user_id;
            userTxt =
              userTxt +
              '</a><img class="icon-img" src="images/blue_marker.png"/></p>';
            document
              .getElementById("tweetList")
              .insertAdjacentHTML(
                "beforeend",
                [
                  '<li class="list-group-item">',
                  userTxt,
                  '<a href="https://twitter.com/' +
                    datum.user_id +
                    "/status/" +
                    datum.id +
                    '" target="_blank">',
                  datum.description + "</a>",
                  '<br/><p class="tweet-timestamp">' +
                    (index > 0 ? created.substring(0, index) : created) +
                    "</p></li>",
                ].join(""),
              );
          } else {
            document
              .getElementById("tweetList")
              .insertAdjacentHTML(
                "beforeend",
                [
                  '<li class="list-group-item">',
                  '<p class="tweet-user"><img class="icon-img" src="images/red_marker.png"/></p>',
                  datum.description,
                  '<br/><p class="tweet-timestamp">' +
                    (index > 0 ? created.substring(0, index) : created) +
                    "</p></li>",
                ].join(""),
              );
          }
        });
      } else {
        BootstrapExt.warning("Unable to retrieve event(s).");
      }
    } catch (e) {
      console.log(e);
    }
  },
});

const dotMap = create_DOT_Incident_Map();

dotMap.interval = window.setInterval(
  () => (document.getElementById("message").innerHTML += "."),
  1000,
);

export default dotMap;
