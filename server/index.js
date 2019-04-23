/**
 * Entry point to program. Starts express server making database available via
 * REST API, and watches for Tweets in real time and adds them to the database
 * when appropriate.
 */

const express = require("express");

// Port for server to use
const PORT = 80;

// Initialize database connection
const postgres = require("./postgres");
postgres.testConnection();

// Initialize server
const app = express();

// Begin watching for tweets to add to database.
require("./tweetStreamer");

// Begin listening for connections
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Make database contents available via REST api
app.get("/tweets", async (req, res, next) => {
  const data = await postgres.fetch();
  res.json(data);
});
