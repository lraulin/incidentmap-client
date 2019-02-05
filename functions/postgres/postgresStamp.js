const HasLog = require("../HasLog");
const Privatize = require("@stamp/privatize");
const Sequelize = require("sequelize");
const { postgresConfig } = require("../secrets");

// Sequelize model
const tweetModelArgs = [
  "tweet",
  {
    tweet_id: Sequelize.BIGINT,
    incident_id: Sequelize.STRING(50),
    body: Sequelize.STRING(300),
    latitude: Sequelize.REAL,
    longitude: Sequelize.REAL,
    serialized: Sequelize.JSONB
  }
];

const postgresStamp = HasLog.compose(
  Privatize,
  {
    name: "Postgres",
    props: {
      Sequelize: require("sequelize"),
      sequelize: null,
      Client: require("pg").client,
      client: null,
      models: {}
    },
    init({ database, username, password, host }) {
      // Initialize connection
      this.sequelize = new this.Sequelize(database, username, password, {
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
      this.models.tweetModel = this.sequelize.define(...tweetModelArgs);
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
      }
    }
  }
);

const postgresClient = postgresStamp(postgresConfig);
postgresClient.testConnection();
