const data = require("./tweets_export_1549295200092.json");

const typesCount = {};

Object.values(data).forEach(tweet => {
  if (Array.isArray(tweet.incidentType)) {
    const count = tweet.incidentType.length;
    if (typesCount[count]) typesCount[count]++;
    else typesCount[count] = 1;
  }
});

console.log(typesCount);
