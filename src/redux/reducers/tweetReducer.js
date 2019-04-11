import { actionTypes } from "../actions";
import filterTweets from "../filterTweets";

const initialState = {
  tweetIdList: [],
  tweetDict: {},
  visibleTweetIds: [],
  selectedMarkerIds: [],
};

const tweetReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_TWEETS:
      const tweetDict = action.tweets;
      const tweetIdList = Object.keys(tweetDict);
      return { ...state, tweetIdList, tweetDict };
    case actionTypes.SET_FILTER:
    case actionTypes.RESET_FILTER:
      const visibleTweetIds = filterTweets({
        filterSettings: action.filter,
        tweetIdList: state.tweetIdList,
        tweetDict: state.tweetDict,
      });
      return { ...state, visibleTweetIds };
    case actionTypes.SET_SELECTED_MARKERS:
      return { ...state, selectedMarkerIds: action.selectedMarkerIds };
    default:
      return state;
  }
};

export default tweetReducer;
