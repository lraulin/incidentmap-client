import { actionTypes } from "./actions";
import filterTweets from "./filterTweets";

const initialState = {
  tweetIdList: [],
  tweetDict: {},
  visibleTweetIds: [],
  selectedMarkerIds: [],
  filterSettings: {
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
      drone: true,
    },
  },
};

const rootReducer = (state = initialState, action) => {
  if (
    [
      actionTypes.UPDATE_TWEETS,
      actionTypes.SET_FILTER,
      actionTypes.RESET_FILTER,
    ].includes(action.type)
  ) {
    let tweetDict, tweetIdList, visibleTweetIds, filterSettings;
    if (action.type === actionTypes.UPDATE_TWEETS) {
      tweetDict = action.tweetDict;
      console.log(tweetDict);
      tweetIdList = Object.keys(tweetDict);
      filterSettings = state.filterSettings;
    } else if (action.type === actionTypes.SET_FILTER) {
      ({ tweetDict, tweetIdList, visibleTweetIds } = state);
      filterSettings = action.filterSettings;
    } else if (action.type === actionTypes.RESET_FILTER) {
      ({ filterSettings } = initialState);
      ({ tweetDict, tweetIdList } = state);
    }

    visibleTweetIds = filterTweets({
      filterSettings,
      tweetIdList,
      tweetDict,
    });

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
