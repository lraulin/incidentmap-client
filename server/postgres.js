/**
 * This module initializes a connection to the database using Sequelize ORM when
 * imported, and exposes methods to read to and write from the database.
 */

const Sequelize = require("sequelize");
const {
  postgresConfig: { user, password, database, host }
} = require("./secrets.js");

// initialize connection
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  operatorsAliases: false
});

// Create model for tweets table
const TweetModel = sequelize.define(
  "tweet",
  {
    tweet_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true },
    incident_id: Sequelize.STRING(50),
    body: Sequelize.STRING(300),
    latitude: Sequelize.REAL,
    longitude: Sequelize.REAL,
    serialized: Sequelize.JSON
  },
  { tableName: "tweets" }
);

module.exports = {
  testConnection() {
    sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });
  },
  saveTweet(tweet) {
    TweetModel.build({
      tweet_id: tweet.id_str,
      incident_id: tweet.incidentType
        ? Array.isArray(tweet.incidentType)
          ? tweet.incidentType[0]
          : tweet.incidentType
        : null,
      body: tweet.text,
      latitude: tweet.coordinates.Latitude,
      longitude: tweet.coordinates.Longitude,
      serialized: tweet
    })
      .save()
      .catch(e => console.log(e));
  },
  /**
   * Fetch all tweets from the database and return them as an object
   * containing key value pairs where the key is the id and the value is the
   * tweet data.
   */
  async fetch() {
    const res = await TweetModel.findAll();
    const tweetsArr = res.map(item => item.dataValues.serialized);
    const tweets = {};
    res.forEach(
      item => (tweets[item.dataValues.tweet_id] = item.dataValues.serialized)
    );
    return tweets;
  }
};
