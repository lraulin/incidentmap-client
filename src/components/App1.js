import React, { useState, useEffect } from "react";
import "../styles/App.css";
import secrets from "../secrets";
import { incidentDictionary } from "../utilities/incidents";
import axios from "axios";
import _ from "lodash";
import firebase from "../firebase";
import createIncidentMap from "../incident_map";
import SearchPane from "./SearchPane";
import TweetPane from "./TweetPane";
import Map from "./Map.old";

// REST API url for mock database
const JSON_SERVER_URL = "http://localhost:3001/posts";

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
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState(null);
  const [filteredTweets, setFilteredTweets] = useState(null);
  const [filter, setFilter] = useState({
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

  const saveLocal = tweets => {
    localStorage.setItem("tweets", JSON.stringify(tweets));
  };

  const getLocal = () => {
    return JSON.parse(localStorage.getItem("tweets"));
  };

  const changeFilterText = text => {
    console.log(text);
    filter.text = text;
    setFilter(filter);
  };

  const toggleCheckBox = name => {
    filter.incidentTypes[name] = !filter.incidentTypes[name];
    setFilter(filter);
    applyFilter(filter, getLocal());
  };

  const applyFilter = (opts, allTweets) => {
    if (!allTweets || !map) return;
    const { startDate, endDate, incidentTypes, text } = opts;
    const selectedTypes = Object.keys(incidentTypes).filter(
      key => incidentTypes[key]
    );
    let tweetList = Object.values(allTweets);

    // Filters
    const notRetweet = t => !("retweeted_status" in t);
    const inDateRange = t =>
      new Date(t.created_at) >= startDate && new Date(t.created_at) <= endDate;
    const matchesText = tweet =>
      text.split(" ").some(word => tweet.text.includes(word));
    const hasTypes = t => {
      if (typeof t.incidentType === "string") {
        return selectedTypes.includes(t.incidentType);
      } else if (typeof t.incidentType === "object") {
        // Tweet has an array of incident types; at least one must be selected
        return t.incidentType.some(type => selectedTypes.includes(type));
      }
    };

    // Apply filters if applicable.
    tweetList = tweetList.filter(notRetweet);
    tweetList =
      startDate && endDate ? tweetList.filter(inDateRange) : tweetList;
    tweetList = text ? tweetList.filter(matchesText) : tweetList;
    tweetList = incidentTypes ? tweetList.filter(hasTypes) : tweetList;

    // map.updateMarkers(tweetList);
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
    // because the on value listener doesn't always fire immediately when
    // page is reloaded
    if (!getLocal()) {
      console.log("firebaseFetch: Fetching from Firebase...");
      ref
        .once("value")
        .then(snapshot => {
          const fetchedTweets = snapshot.val();
          if (fetchedTweets) {
            saveLocal(fetchedTweets);
            applyFilter(filter, fetchedTweets);
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
        saveLocal(fetchedTweets);
        applyFilter(filter, fetchedTweets);
      }
    });
  };

  const reset = () => {
    const incidentTypes = filter.incidentTypes;
    Object.keys(incidentTypes).forEach(key => (incidentTypes[key] = false));
    const resetFilter = {
      startDate: null,
      endDate: null,
      incidentTypes,
      text: null
    };
    setFilter(resetFilter);
    applyFilter(resetFilter);
  };

  const retry = () => {
    // If we don't have Tweets, retry every 2 seconds until we do.
    if (!getLocal()) {
      firebaseInit();
      setTimeout(() => retry(), 2000);
    }
  };

  // ComponentDidMount
  useEffect(() => {
    if (!mounted) {
      firebaseInit();

      // const map = createIncidentMap();
      // map.initMap();
      // setMap(map);

      const tweets = getLocal();
      if (tweets) {
        applyFilter(filter, tweets);
      }
    }
    setMounted(true);
  });

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
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
            <div className="collapse show" id="collapseExample">
              <div className="card card-body" style={{ height: "100%" }}>
                <SearchPane
                  setFilter={setFilter}
                  filter={filter}
                  toggleCheckBox={toggleCheckBox}
                  changeFilterText={changeFilterText}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-7" style={{ height: "100vh" }}>
            {/* <div style={{ height: "100vh", width: "100%" }} id="myMap" /> */}
            <Map filteredTweets={filteredTweets} />
          </div>
        </div>
        <div className="col-sm-3 d-none d-lg-block" style={{ height: "100vh" }}>
          <TweetPane filteredTweets={filteredTweets} />
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
