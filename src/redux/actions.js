import { initialState } from "./reducers/filterReducer";

export const actionTypes = {
  UPDATE_TWEETS: "UPDATE_TWEETS",
  SET_FILTER: "SET_FILTER",
  RESET_FILTER: "RESET_FILTER",
  SET_SELECTED_MARKERS: "SET_SELECTED_MARKERS",
};

export const updateTweets = ({ tweets }) => ({
  type: actionTypes.UPDATE_TWEETS,
  tweets,
});

export const setFilter = filter => ({
  type: actionTypes.SET_FILTER,
  filter,
});

export const resetFilter = () => ({
  type: actionTypes.RESET_FILTER,
  filter: initialState,
});

export const setSelectedMarkers = selectedMarkerIds => ({
  type: actionTypes.SET_SELECTED_MARKERS,
  selectedMarkerIds,
});
