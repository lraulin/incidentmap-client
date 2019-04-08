import React, { useState, useEffect, useRef } from "react";
import createIncidentMap from "../incident_map";
import SearchPane from "./SearchPane";
import TweetPane from "./TweetPane";
import { compose, filter, into, takeLast, uniqBy } from "ramda";
import { googleMapsApiKey } from "../secrets";
import "../styles/App.css";

const TWEET_URL = "http://ec2-3-93-147-139.compute-1.amazonaws.com/tweets";

const AppContainer = () => {
  // Collection of Tweets matching selected criteria that will be displayed.
  const [tweetPaneTweets, setTweetPaneTweets] = useState([]);
  // Reference to module that handles map and markers.
  const mapRef = useRef(
    createIncidentMap({ apiKey: googleMapsApiKey, divName: "myMap" })
  );
  // Values for form elements.
  const [filterSettings, setFilterSettings] = useState({
    text: "",
    startDate: null,
    endDate: null,
    incidentTypes: {
      fatalCrash: true,
      pedestrianCrash: true,
      cyclistCrash: true,
      truckCrash: true,
      busCrash: true,
      transitCrash: true,
      transSuicide: true,
      pipeline: true,
      hazmat: true,
      rail: true,
      road: true,
      unsafe: true,
      drone: true
    }
  });

  const cacheTweets = tweets => {
    localStorage.setItem("tweets", JSON.stringify(tweets));
  };

  const getTweetCache = () => {
    // Retrieve Tweets from cache and display on map if present.
    const tweets = JSON.parse(localStorage.getItem("tweets"));
    if (tweets) filterTweets({ tweets });
  };

  const changeFilterSettings = settings => {
    setFilterSettings(settings);
    filterTweets(settings);
  };

  const toggleCheckBox = name => {
    filterSettings.incidentTypes[name] = !filterSettings.incidentTypes[name];
    setFilterSettings(filterSettings);
    filterTweets({ tweets: getTweetCache() });
  };

  const filterTweets = ({
    text = filterSettings.text,
    startDate = filterSettings.startDate,
    endDate = filterSettings.endDate,
    incidentTypes = filterSettings.incidentTypes,
    tweets = getTweetCache() || {}
  }) => {
    // Create collection of Tweets that match user settings and update markers.
    if (tweets === {} || !mapRef.current) {
      console.log("No tweets or map");
      return;
    }
    cacheTweets(tweets);
    const selectedTypes = Object.keys(incidentTypes).filter(
      key => incidentTypes[key]
    );
    const tweetList = Object.values(tweets);
    console.log(`filtering ${tweetList.length} tweets`);
    console.log(tweetList[0]);

    // Predicates for filter callback--return true if condition is met.
    const notRetweet = t => !("retweeted_status" in t);
    const inDateRange = t => {
      if (startDate && endDate) {
        return (
          new Date(t.created_at) >= startDate &&
          new Date(t.created_at) <= endDate
        );
      } else {
        return true;
      }
    };
    const matchesText = tweet => {
      if (text !== "") {
        return text
          .toLowerCase()
          .split(" ")
          .some(word => tweet.text.toLowerCase().includes(word));
      } else {
        return true;
      }
    };
    const hasTypes = t => {
      if (typeof t.incidentType === "string") {
        return selectedTypes.includes(t.incidentType);
      } else if (Array.isArray(t.incidentType)) {
        return t.incidentType.some(type => selectedTypes.includes(type));
      } else {
        return false;
      }
    };

    // Combine filters with compose.
    const tweetFilter = compose(
      filter(notRetweet),
      filter(inDateRange),
      filter(matchesText),
      filter(hasTypes)
    );

    // Remove identical tweets even if urls contained in text field differ.
    const justText = text => text.slice(0, text.indexOf(" http"));
    const filteredTweets = uniqBy(
      t => justText(t.text),
      into([], tweetFilter, tweetList)
    );

    // Update the map to show positions for filtered Tweets.
    mapRef.current.updateMarkers(filteredTweets);

    // Get an array of most recent 7 Tweets to display in TweetPane.
    const top7 = takeLast(7, filteredTweets);
    setTweetPaneTweets(top7);
  };

  // Clear form fields and update markers.
  const resetFilter = () => {
    const incidentTypes = filter.incidentTypes;
    Object.keys(incidentTypes).forEach(key => (incidentTypes[key] = false));
    filterSettings.startDate = null;
    filterSettings.endDate = null;
    filterSettings.text = null;
    filterTweets();
  };

  // Get data from database
  const fetchTweets = async () => {
    const response = await fetch(TWEET_URL);

    if (response.status === 200) {
      const tweets = await response.json();
      // Cache tweets in localStorage.
      cacheTweets(tweets);
      filterTweets({ tweets });
    }
  };

  // Initialization
  useEffect(() => {
    // Initialize the map.
    mapRef.current.initMap();
    // Display tweets from cache on map if present.
    getTweetCache();
    // Get data from database and update map.
    fetchTweets().catch(e => console.log(e));
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
                <SearchPane
                  filteredTweets={tweetPaneTweets}
                  filterTweets={filterTweets}
                  toggleCheckBox={toggleCheckBox}
                  resetFilter={resetFilter}
                  filterSettings={filterSettings}
                  setFilterSettings={changeFilterSettings}
                  incidentTypeList={Object.keys(filterSettings.incidentTypes)}
                />
              </div>
            </div>
          </div>
          {/* [[[[[ MAP ]]]]] */}
          <div
            className="col-sm-7"
            style={{ height: "100vh", width: "100%" }}
            id="myMap"
          />
          <div
            className="col-sm-3 d-none d-lg-block"
            style={{ height: "100vh" }}
          >
            <TweetPane filteredTweets={tweetPaneTweets} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
