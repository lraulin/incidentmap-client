const Privatize = require("@stamp/privatize");
const Sequelize = require("sequelize");
const stampit = require("@stamp/it");

// Sequelize model
const tweetModelArgs = [
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
];

module.exports.postgresStamp = stampit(Privatize, {
  name: "Postgres",
  props: {
    sequelize: null,
    client: null,
    models: {},
    buildTweet: null
  },
  init({ database, user, password, host }) {
    console.log(user);
    // Initialize connection
    this.sequelize = new Sequelize(database, user, password, {
      host,
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      operatorsAliases: false
    });

    // Setup models
    this.models.Tweet = this.sequelize.define(...tweetModelArgs);
    this.buildTweet = props => this.models.Tweet.build(props);
  },
  methods: {
    testConnection() {
      this.sequelize
        .authenticate()
        .then(() => {
          console.log("Connection has been established successfully.");
        })
        .catch(err => {
          console.error("Unable to connect to the database:", err);
        });
    },
    saveTweet(tweet) {
      this.buildTweet({
        tweet_id: tweet.id_str,
        incident_id: tweet.incidentType,
        body: tweet.text,
        latitude: tweet.coordinates.Latitude,
        longitude: tweet.coordinates.Longitude,
        serialized: tweet
      })
        .save()
        .catch(e => console.log(e));
    },
    saveTest() {
      const TestModel = this.sequelize.define("public.testtables", {
        id: { type: Sequelize.INTEGER, primaryKey: true },
        name: Sequelize.STRING(50)
      });
      TestModel.build({ id: 1, name: "Blah blah blah" })
        .save({ validate: false })
        .catch(e => console.log(e));
    }
  }
});
