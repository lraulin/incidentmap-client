export const actionTypes = {
  UPDATE_TWEETS: "UPDATE_TWEETS",
  SET_FILTER: "SET_FILTER",
  RESET_FILTER: "RESET_FILTER",
  SET_SELECTED_MARKERS: "SET_SELECTED_MARKERS",
  SET_FILTER_START_DATE: "SET_FILTER_START_DATE",
  SET_FILTER_END_DATE: "SET_FILTER_END_DATE",
};

export const updateTweets = markerList => ({
  type: actionTypes.UPDATE_TWEETS,
  markerList,
});

export const setFilter = filterSettings => ({
  type: actionTypes.SET_FILTER,
  filterSettings,
});

export const setFilterStartDate = startDate => ({
  type: actionTypes.SET_FILTER_START_DATE,
  startDate,
});

export const setFilterEndDate = endDate => ({
  type: actionTypes.SET_FILTER_END_DATE,
  endDate,
});

export const resetFilter = () => ({
  type: actionTypes.RESET_FILTER,
});

export const setSelectedMarkers = selectedMarkerIds => ({
  type: actionTypes.SET_SELECTED_MARKERS,
  selectedMarkerIds,
});
