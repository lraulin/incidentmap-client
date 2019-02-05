module.exports = {
  tweetModelArgs: [
    "tweet",
    {
      id_str: {
        type: this.Sequelize.STRING
      },
      latitude: {
        type: this.Sequelize.DOUBLE
      },
      longitude: {
        type: this.Sequelize.DOUBLE
      },
      text: {
        type: this.Sequelize.STRING
      },
      tweet_info: {
        type: this.Sequelize.JSONB
      }
    },
    {
      freezeTableName: true // Model tableName will be the same as the model name
    }
  ]
};
