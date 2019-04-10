import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import { updateMarkers } from "../incidentMap";
import { getVisibleTweetList, getTweetDict } from "./selectors";
import { googleMapsApiKey } from "../secrets";

const logger = store => next => action => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

// Middleware to make map update markers when filter is changed
const mapMiddleware = store => next => action => {
  if (
    action.type === "SET_FILTER" ||
    action.type === "RESET_FILTER" ||
    action.type === "UPDATE_TWEETS"
  ) {
    console.log(`Map: Action Type: ${action.type}`);
    const result = next(action);
    const state = store.getState();
    updateMarkers(getVisibleTweetList(state), getTweetDict(state));
    return result;
  } else {
    return next(action);
  }
};

export default createStore(rootReducer, applyMiddleware(logger, mapMiddleware));
