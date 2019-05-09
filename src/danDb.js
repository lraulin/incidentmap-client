const { formatDate } = require("./utils");

const baseApiUrl = "http://dotdb2.eastus.cloudapp.azure.com:8082/api/twitter/";

const makeGeoJson = data =>
  data.map(datum => ({
    type: "Feature",
    id: datum.created,
    geometry: {
      type: "Point",
      coordinates: [datum.longitude, datum.latitude],
    },
    properties: {
      fatalities: datum.fatalities,
      injuries: datum.injuries,
      type: datum.type,
      crisis_type: datum.crisis_type,
    },
  }));

export const makeQueryString = ({ startDate, endDate, text }) => {
  let query = "";

  if (startDate) {
    startDate = formatDate(startDate).split("/");
    query = query === "" ? "?" : query + "&";
    query += `from=%27${startDate[2]}-${startDate[0]}-${startDate[1]}%27`;
  }

  if (endDate) {
    endDate = formatDate(endDate).split("/");
    query = query === "" ? "?" : query + "&";
    query += `to=%27${endDate[2]}-${endDate[0]}-${endDate[1]}%27`;
    // query = query + "T23:59:59%27";
  }

  if (text) {
    query = query === "" ? "?" : query + "&";
    query = query + "search=" + text.replace(/\s/g, " %26 ");
  }
  return query;
};

export const getData = (callback, filterSettings) =>
  fetch(baseApiUrl + "history" + makeQueryString({ ...filterSettings }))
    .then(res => res.json())
    .then(myJson => makeGeoJson(myJson))
    .then(geoJson => callback(geoJson))
    .catch(e => console.log(e));
