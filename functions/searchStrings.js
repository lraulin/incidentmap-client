const R = require("ramda");
const incidentTypes = require("./incidentTypes");

const combined = Object.values(incidentTypes).reduce(function(a, c) {
  return (a += c.searchString);
}, "");

const final = R.compose(
  R.replace(/ %26 /g, " "),
  R.replace(/\|/g, ","),
  R.replace(/\)\(/g, ","),
  R.replace(/\)/g, ""),
  R.replace(/\(/g, ""),
  R.toLower()
);

console.log(final());
