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

const getTweetDict = state => state.tweetReducer.tweetDict;

const getTweetList = state => Object.values(getTweetDict(state));

export const getVisibleTweetList = createSelector(
  [
    getFilterText,
    getSelectedIncidentTypes,
    getFilterStartDate,
    getFilterEndDate,
    getTweetList,
  ],
  (text, types, startDate, endDate, tweetList) => {
    if (!tweetList.length) return [];
    console.log(`filtering ${tweetList.length} tweets`);

    // Predicates for filter callback--return true if condition is met.
    const notRetweet = t => !("retweeted_status" in t);
    const inDateRange = t => {
      if (startDate && endDate) {
        return (
          new Date(t.created_at) >= startDate &&
          new Date(t.created_at) <= endDate
        );
      } else {
        return true;
      }
    };
    const matchesText = tweet => {
      if (text !== "") {
        return text
          .toLowerCase()
          .split(" ")
          .some(word => tweet.text.toLowerCase().includes(word));
      } else {
        return true;
      }
    };
    const hasTypes = t => {
      if (typeof t.incidentType === "string") {
        return types.includes(t.incidentType);
      } else if (Array.isArray(t.incidentType)) {
        return t.incidentType.some(type => types.includes(type));
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
    const filteredTweets = uniqBy(
      t => justText(t.text),
      into([], tweetFilter, tweetList),
    );
    console.log(
      `Showing ${filteredTweets.length} of ${tweetList.length} tweets`,
    );
    return filteredTweets;
  },
);
