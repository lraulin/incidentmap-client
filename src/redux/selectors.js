import { createSelector } from "reselect";
import filterTweets from "./filterTweets";

const getFilter = state => state.filterReducer;

const getTweetIds = state => state.tweetReducer.tweetIdList;

export const getTweetDict = state => state.tweetReducer.tweetDict;

export const getVisibleTweetList = createSelector(
  [getFilter, getTweetIds, getTweetDict],
  (filterSettings, tweetIdList, tweetDict) =>
    filterTweets({ filterSettings, tweetIdList, tweetDict }),
);
