/**
 * Entry point to program. Starts express server making database available via
 * REST API, and watches for Tweets in real time and adds them to the database
 * when appropriate.
 */

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//Begin watching for tweets to add to database.
require("./server/tweetStreamer");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html")),
);

// // Make database contents available via REST api
// app.get("/tweets", async (req, res, next) => {
//   const data = await postgres.fetch();
//   res.json(data);
// });
