import React, { useState, useEffect, useRef } from "react";
import "../styles/App.css";
import createIncidentMap from "../util/incident_map";
import SearchPane from "./SearchPane";
import TweetPane from "./TweetPane";
import { compose, filter, into, takeLast, uniqBy } from "ramda";
import { googleMapsApiKey } from "../data/secrets";

const AppContainer = () => {
  const [filteredTweets, setFilteredTweets] = useState([]);
  const mapRef = useRef(
    createIncidentMap({ apiKey: googleMapsApiKey, divName: "myMap" })
  );
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
    return JSON.parse(localStorage.getItem("tweets"));
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

    // Filters
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

    // Apply filters if applicable.
    const tweetFilter = compose(
      filter(notRetweet),
      filter(inDateRange),
      filter(matchesText),
      filter(hasTypes)
    );

    // Dedup
    const justText = text => text.slice(0, text.indexOf(" http"));
    const filteredTweets = uniqBy(
      t => justText(t.text),
      into([], tweetFilter, tweetList)
    );

    const top7 = takeLast(7, filteredTweets);
    if (top7.length && top7[top7.length - 1].db_created)
      console.log(top7[top7.length - 1].db_created);
    setFilteredTweets(top7);
    mapRef.current.updateMarkers(filteredTweets);
  };

  const resetFilter = () => {
    const incidentTypes = filter.incidentTypes;
    Object.keys(incidentTypes).forEach(key => (incidentTypes[key] = false));
    filterSettings.startDate = null;
    filterSettings.endDate = null;
    filterSettings.text = null;
    filterTweets();
  };

  const fetchTweets = async () => {
    let response = await fetch("http://localhost:3050/tweets");

    if (response.status === 200) {
      const tweets = await response.json();
      console.log(tweets);
      cacheTweets(tweets);
      filterTweets({ tweets });
    }
  };

  // Initialization
  useEffect(() => {
    mapRef.current.initMap();

    const tweets = getTweetCache();
    if (tweets) {
      filterTweets({ tweets });
    }

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
                  filteredTweets={filteredTweets}
                  filterTweets={filterTweets}
                  toggleCheckBox={toggleCheckBox}
                  resetFilter={resetFilter}
                  filterSettings={filterSettings}
                  setFilterSettings={changeFilterSettings}
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
            <TweetPane filteredTweets={filteredTweets} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
