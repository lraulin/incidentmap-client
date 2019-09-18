import { incidentTypes } from "./data";

const fetchAsync = async url => await (await fetch(url)).json();

// Add start and end dates to query string
const appendFromToDates = (query, startDate, endDate) => {
  if (startDate) {
    startDate = startDate.split("/");
    query = query === "" ? "?" : query + "&";
    query += `from=%27${startDate[2]}-${startDate[0]}-${startDate[1]}%27"`;
  }
  if (endDate) {
    endDate = endDate.split("/");
    query = query === "" ? "?" : query + "&";
    query += `to=%27${endDate[2]}-${endDate[0]}-${endDate[1]}T23:59:59%27`;
  }
  return query;
};

// Add filter text to query string
const appendSearchText = (query, searchText) => {
  if (searchText.value !== "") {
    query = query === "" ? "?" : query + "&";
    query += "search=" + searchText.value.replace(/\s/g, " %26 ");
  }
  return query;
};

const loadLayers = async ({ startDate, endDate }) => {
  const baseApiUrl =
    "http://dotdb2.eastus.cloudapp.azure.com:8082/api/twitter/";
  const promises = [];
  incidentTypes.forEach(async incident => {
    const url =
      baseApiUrl +
      "history" +
      appendFromToDates("?query=" + incident.searchString, startDate, endDate);
    console.log(url);
    promises.push(fetchAsync(url));
  });
  return Promise.all(promises);
};

export const getData = async filterSettings => {
  const data = [].concat(...(await loadLayers(filterSettings)));
  console.log("DATA:");
  console.log(data);
  return data;
};
