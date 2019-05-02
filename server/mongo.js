const mongoose = require("mongoose");
const logger = require("../share/logger");

mongoose.connect("mongodb://localhost:27017/incidentmap", {
  useNewUrlParser: true,
});

const Tweet = mongoose.model("Tweet", {
  _id: String,
  lat: Number,
  lng: Number,
  type: String,
  data: Object,
});

const saveTweet = ({ _id, lat, lng, type, data }) => {
  const tweet = new Tweet({ _id, lat, lng, type, data });
  tweet
    .save()
    .then(() =>
      logger.log(
        "info",
        `Tweet ${_id} saved with type ${type}, lat: ${lat}, lng: ${lng}.`,
      ),
    )
    .catch(err => console.log(err));
};

module.exports = { saveTweet };
