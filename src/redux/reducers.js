import { actionTypes } from "./actions";
import { getData } from "../dansApi";
import filterTweets from "./filterTweets";

const initialIncidentTypes = {
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
  drone: true,
};

Object.freeze(initialIncidentTypes);

const initialFilterSettings = {
  text: "",
  startDate: null,
  endDate: null,
  incidentTypes: initialIncidentTypes,
};

Object.freeze(initialFilterSettings);

const initialState = {
  tweetIdList: [],
  tweetDict: {},
  visibleTweetIds: [],
  selectedMarkerIds: [],
  filterSettings: initialFilterSettings,
};

Object.freeze(initialState);

// Create a deep clone of the initial state
const getInitialState = () => ({
  ...initialState,
  filterSettings: {
    ...initialFilterSettings,
    incidentTypes: { ...initialIncidentTypes },
  },
});

// Create a deep clone of the initial filter settings
const getInitialFilterSettings = () => ({
  ...initialFilterSettings,
  incidentTypes: { ...initialIncidentTypes },
});

const rootReducer = (state = getInitialState(), action) => {
  // If the action changes the Tweet collection or the filter settings,
  // update the visible tweet collection accordingly.
  if (
    [
      actionTypes.UPDATE_TWEETS,
      actionTypes.SET_FILTER,
      actionTypes.RESET_FILTER,
      actionTypes.SET_FILTER_START_DATE,
      actionTypes.SET_FILTER_END_DATE,
    ].includes(action.type)
  ) {
    let tweetDict, tweetIdList, visibleTweetIds, filterSettings;
    if (action.type === actionTypes.UPDATE_TWEETS) {
      tweetDict = {};
      action.markerList.forEach(marker => (tweetDict[marker.created] = marker));
      tweetIdList = Object.keys(tweetDict);
      filterSettings = state.filterSettings;
    } else if (action.type === actionTypes.SET_FILTER) {
      ({ tweetDict, tweetIdList, visibleTweetIds } = state);
      filterSettings = action.filterSettings;
    } else if (action.type === actionTypes.RESET_FILTER) {
      filterSettings = getInitialFilterSettings();
      ({ tweetDict, tweetIdList } = state);
    } else if (action.type === actionTypes.SET_FILTER_START_DATE) {
      ({ tweetDict, tweetIdList, visibleTweetIds } = state);
      const startDate = action.startDate;
      filterSettings = { ...state.filterSettings, startDate };
    } else if (action.type === actionTypes.SET_FILTER_END_DATE) {
      ({ tweetDict, tweetIdList, visibleTweetIds } = state);
      const endDate = action.endDate;
      filterSettings = { ...state.filterSettings, endDate };
    }

    // visibleTweetIds = filterTweets({
    //   filterSettings,
    //   tweetIdList,
    //   tweetDict,
    // });

    //TODO: This is where to make API call
    getData(filterSettings);

    return {
      ...state,
      tweetDict,
      tweetIdList,
      visibleTweetIds,
      filterSettings,
    };
  } else if (actionTypes.SET_SELECTED_MARKERS) {
    const { selectedMarkerIds } = action;
    return { ...state, selectedMarkerIds: selectedMarkerIds };
  }
};

export default rootReducer;
