import { createSelector } from "reselect";
import { compose, filter, into, uniqBy } from "ramda";

const getFilter = state => state.filterReducer;

const getFilterText = state => getFilter(state).text;

const getFilterStartDate = state => getFilter(state).startDate;

const getFilterEndDate = state => getFilter(state).endDate;

const getFilterIncidentTypes = state => getFilter(state).incidentTypes;

const getSelectedIncidentTypes = state => {
  const incidentTypes = getFilterIncidentTypes(state);
  return Object.keys(incidentTypes).filter(key => incidentTypes[key]);
};

const getTweetIds = state => state.tweetReducer.tweetIdList;

export const getTweetDict = state => state.tweetReducer.tweetDict;

const getTweetList = state => Object.values(getTweetDict(state));

export const getVisibleTweetList = createSelector(
  [
    getFilterText,
    getSelectedIncidentTypes,
    getFilterStartDate,
    getFilterEndDate,
    getTweetIds,
    getTweetDict,
  ],
  (text, types, startDate, endDate, tweetIdList, tweetDict) => {
    if (!tweetIdList.length) return [];

    // Predicates for filter callback--return true if condition is met.
    const notRetweet = id => !("retweeted_status" in tweetDict[id]);
    const inDateRange = id => {
      if (startDate && endDate) {
        return (
          new Date(tweetDict[id].created_at) >= startDate &&
          new Date(tweetDict[id].created_at) <= endDate
        );
      } else {
        return true;
      }
    };
    const matchesText = id => {
      if (text !== "") {
        return text
          .toLowerCase()
          .split(" ")
          .some(word => tweetDict[id].text.toLowerCase().includes(word));
      } else {
        return true;
      }
    };
    const hasTypes = id => {
      if (typeof tweetDict[id].incidentType === "string") {
        return types.includes(tweetDict[id].incidentType);
      } else if (Array.isArray(tweetDict[id].incidentType)) {
        return tweetDict[id].incidentType.some(type => types.includes(type));
      } else {
        return false;
      }
    };

    // Combine filters with compose.
    const tweetFilter = compose(
      filter(notRetweet),
      filter(inDateRange),
      filter(matchesText),
      filter(hasTypes),
    );

    // Remove identical tweets even if urls contained in text field differ.
    const justText = text => text.slice(0, text.indexOf(" http"));
    const filteredTweetIds = uniqBy(
      id => justText(tweetDict[id].text),
      into([], tweetFilter, tweetIdList),
    );
    console.log(
      `Showing ${filteredTweetIds.length} of ${tweetIdList.length} tweets`,
    );
    return filteredTweetIds;
  },
);
