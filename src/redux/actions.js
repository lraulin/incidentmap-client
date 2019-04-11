export const actionTypes = {
  UPDATE_TWEETS: "UPDATE_TWEETS",
  SET_FILTER: "SET_FILTER",
  RESET_FILTER: "RESET_FILTER",
  SET_SELECTED_MARKERS: "SET_SELECTED_MARKERS",
};

export const updateTweets = tweetDict => ({
  type: actionTypes.UPDATE_TWEETS,
  tweetDict,
});

export const setFilter = filterSettings => ({
  type: actionTypes.SET_FILTER,
  filterSettings,
});

export const resetFilter = () => ({
  type: actionTypes.RESET_FILTER,
});

export const setSelectedMarkers = selectedMarkerIds => ({
  type: actionTypes.SET_SELECTED_MARKERS,
  selectedMarkerIds,
});
