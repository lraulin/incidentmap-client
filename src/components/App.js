import React, { useState, useEffect, useRef } from "react";
import "../styles/App.css";
import secrets from "../secrets";
import firebase from "../firebase";
import createIncidentMap from "../incident_map";
import SearchPane from "./SearchPane";
import TweetPane from "./TweetPane";
import { compose, filter, into, takeLast } from "ramda";

const isEmpty = x => {
  if (!x) {
    return true;
  } else if (Array.isArray(x) && x.length === 0) {
    return true;
  } else if (Object.keys(x).length === 0) {
    return true;
  } else {
    return false;
  }
};

const AppContainer = () => {
  const [filteredTweets, setFilteredTweets] = useState([]);
  const mountedRef = useRef(false);
  const mapRef = useRef(createIncidentMap());
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
    if (isEmpty(tweets) || !mapRef.current) {
      console.log("No tweets or map");
      return;
    }
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
        return text.split(" ").some(word => tweet.text.includes(word));
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
    const filteredTweets = into([], tweetFilter, tweetList);
    setFilteredTweets(takeLast(7, filteredTweets));
    mapRef.current.updateMarkers(filteredTweets);
  };

  const firebaseInit = async () => {
    await firebase.auth().signOut();
    firebase
      .auth()
      .signInWithEmailAndPassword(
        secrets.firebase.user,
        secrets.firebase.password
      )
      .then(res => {
        console.log("Firebase initialized!");
        firebaseFetch();
      })
      .catch(error => {
        if (error.code === "auth/user-not-found") {
          console.log("Error logging in.");
        }
      });
  };

  const firebaseFetch = () => {
    const ref = firebase.database().ref("tweets");
    // fetch data once if local cache is empty,
    if (!getTweetCache()) {
      console.log("firebaseFetch: Fetching from Firebase...");
      ref
        .once("value")
        .then(snapshot => {
          const fetchedTweets = snapshot.val();
          if (fetchedTweets) {
            cacheTweets(fetchedTweets);
            filterTweets({ tweets: fetchedTweets });
          } else {
            console.log("firebaseFetch: Something went wrong...no tweets...");
          }
        })
        .catch(e => console.log(e));
    } else {
      console.log("firebaseFetch: Tweets already fetched.");
    }
    // make sure we're not creating duplicate listeners
    ref.off();
    // create listener to update state whenever database changes
    ref.on("value", snapshot => {
      const fetchedTweets = snapshot.val();
      if (fetchedTweets) {
        console.log("Retrieved tweets from Firebase!");
        cacheTweets(fetchedTweets);
        filterTweets({ tweets: fetchedTweets });
      }
    });
  };

  const resetFilter = () => {
    const incidentTypes = filter.incidentTypes;
    Object.keys(incidentTypes).forEach(key => (incidentTypes[key] = false));
    filterSettings.startDate = null;
    filterSettings.endDate = null;
    filterSettings.text = null;
    filterTweets();
  };

  const retry = () => {
    // If we don't have Tweets, retry every 2 seconds until we do.
    if (!getTweetCache()) {
      firebaseInit();
      setTimeout(() => retry(), 2000);
    }
  };

  const initMap = async () => {
    mapRef.current.initMap();

    const tweets = getTweetCache();
    if (tweets) {
      filterTweets(filter, tweets);
    }
    firebaseInit();
  };

  // ComponentDidMount
  useEffect(() => {
    if (!mountedRef.current) {
      initMap();
    }
    mountedRef.current = true;
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
          {/* [[[[[ SEARCH ]]]]] */}
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
