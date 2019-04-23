const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/incidentmap", {
  useNewUrlParser: true,
});

const Tweet = mongoose.model("Tweet", {
  id: String,
  lat: Number,
  lng: Number,
  type: Array,
  data: Object,
});

const saveTweet = ({ id, lat, lng, type, data }) => {
  const tweet = new Tweet({ id, lat, lng, type, data });
  tweet
    .save()
    .then(() => console.log("Tweet Saved!"))
    .catch(err => console.log(err));
};

module.exports = { saveTweet };
