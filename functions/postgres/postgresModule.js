const Sequelize = require("sequelize");
const {
  postgresConfig: { user, password, database, host }
} = require("../secrets.js");

module.exports = (() => {
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

  // Create model
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

  return {
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
        incident_id: Array.isArray(tweet.incidentType)
          ? tweet.incidentType[0]
          : tweet.incidentType,
        body: tweet.text,
        latitude: tweet.coordinates.Latitude,
        longitude: tweet.coordinates.Longitude,
        serialized: tweet
      })
        .save()
        .catch(e => console.log(e));
    }
  };
})();
