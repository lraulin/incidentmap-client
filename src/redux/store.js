import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import createIncidentMap from "../incident_map";
import { getTweetsByVisibilityFilter } from "./selectors";
import { googleMapsApiKey } from "../secrets";

const incidentMap = createIncidentMap();
incidentMap.initMap({ apiKey: googleMapsApiKey });

const logger = store => next => action => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

const mapMiddleware = store => next => action => {
  if (action.type === "SET_FILTER" || action.type === "UPDATE_TWEETS") {
    console.log(`Map: Action Type: ${action.type}`);
    const result = next(action);
    const state = store.getState();
    const filteredTweets = getTweetsByVisibilityFilter(
      state.tweets.allIds,
      state.visibilityFilter,
    );
    incidentMap.updateMarkers(filteredTweets);
    return result;
  } else {
    return next(action);
  }
};

export default createStore(rootReducer, applyMiddleware(logger, mapMiddleware));
