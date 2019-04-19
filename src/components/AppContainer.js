import React, { useEffect } from "react";
import TweetPane from "./TweetPane";
import "../styles/App.css";
import { connect } from "react-redux";
import { updateTweets } from "../redux/actions";
import MapNav from "./MapNav";

import mockDatabase from "../incident-report-map-export";

const TWEET_URL = "http://ec2-3-93-147-139.compute-1.amazonaws.com/tweets";

const mapDispatchToProps = dispatch => ({
  updateTweets: tweets => dispatch(updateTweets(tweets)),
});

const App = props => {
  const cacheTweets = tweets => {
    localStorage.setItem("tweets", JSON.stringify(tweets));
  };

  const getTweetCache = () => {
    console.log("getting tweet cache");
    // Retrieve Tweets from cache and display on map if present.
    const tweets = JSON.parse(localStorage.getItem("tweets"));
    if (tweets && Object.keys(tweets).length) {
      console.log("tweets retrieved from cache");
      props.updateTweets(tweets);
    } else if (process.env.NODE_ENV === "development") {
      console.log("using mock database");
      props.updateTweets(mockDatabase.tweets);
    }
  };

  // Get data from database
  const fetchTweets = async () => {
    const response = await fetch(TWEET_URL);

    if (response.status === 200) {
      const tweets = await response.json();
      // Cache tweets in localStorage.
      cacheTweets(tweets);
      props.updateTweets({ tweets });
    }
  };

  // Initialization
  useEffect(() => {
    // Display tweets from cache on map if present.
    getTweetCache();
    // Get data from database and update map.
    //fetchTweets().catch(e => console.log(e));
  }, []);

  return <App {...props} />;
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
