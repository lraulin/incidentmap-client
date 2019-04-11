import React, { useEffect } from "react";
import SearchPane from "./SearchPane";
import TweetPane from "./TweetPane";
import "../styles/App.css";
import { connect } from "react-redux";
import { updateTweets } from "../redux/actions";

import mockDatabase from "../incident-report-map-export";

const TWEET_URL = "http://ec2-3-93-147-139.compute-1.amazonaws.com/tweets";

const mapDispatchToProps = dispatch => ({
  updateTweets: tweets => dispatch(updateTweets(tweets)),
});

const App = ({ updateTweets }) => {
  const cacheTweets = tweets => {
    localStorage.setItem("tweets", JSON.stringify(tweets));
  };

  const getTweetCache = () => {
    console.log("getting tweet cache");
    // Retrieve Tweets from cache and display on map if present.
    const tweets = JSON.parse(localStorage.getItem("tweets"));
    if (tweets && Object.keys(tweets).length) {
      console.log("tweets retrieved from cache");
      updateTweets(tweets);
    } else if (process.env.NODE_ENV === "development") {
      console.log("using mock database");
      updateTweets(mockDatabase.tweets);
    }
  };

  // Get data from database
  const fetchTweets = async () => {
    const response = await fetch(TWEET_URL);

    if (response.status === 200) {
      const tweets = await response.json();
      // Cache tweets in localStorage.
      cacheTweets(tweets);
      updateTweets({ tweets });
    }
  };

  // Initialization
  useEffect(() => {
    // Display tweets from cache on map if present.
    getTweetCache();
    // Get data from database and update map.
    //fetchTweets().catch(e => console.log(e));
  }, []);

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          {/* [[[[[ SEARCH ]]]]] */}
          <div className="col-sm-2" style={{ height: "100vh" }}>
            <a
              style={{ width: "100%" }}
              className="btn btn-dark"
              data-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="true"
              aria-controls="collapseExample"
            >
              Filter Settings
            </a>
            <div className="collapse show" id="collapseExampl">
              <div className="card card-body" style={{ height: "100%" }}>
                <SearchPane />
              </div>
            </div>
          </div>
          {/* [[[[[ MAP ]]]]] */}
          <div
            className="col-sm-7"
            style={{ height: "100vh", width: "100%" }}
            id="map"
          />
          <div
            className="col-sm-3 d-none d-lg-block"
            style={{ height: "100vh" }}
          >
            <TweetPane />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
