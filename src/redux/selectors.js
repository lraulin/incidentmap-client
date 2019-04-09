import { compose, filter, into, uniqBy } from "ramda";

export const getTweetState = store => store.tweets;

export const getTweetList = store =>
  getTweetState(store) ? getTweetState(store).allIds : [];

export const getTweetById = (store, id) =>
  getTweetState(store) ? { ...getTweetState(store).byIds[id], id } : {};

export const getTweetsByVisibilityFilter = (tweets, filterSettings) => {
  console.log(tweets);
  console.log(filterSettings);
  const { text, incidentTypes, startDate, endDate } = filterSettings;
  const types = Object.keys(incidentTypes).filter(key => incidentTypes[key]);
  const tweetList = Object.values(tweets);
  console.log(`filtering ${tweetList.length} tweets`);
  console.log(tweetList[0]);

  // Predicates for filter callback--return true if condition is met.
  const notRetweet = t => !("retweeted_status" in t);
  const inDateRange = t => {
    if (startDate && endDate) {
      return (
        new Date(t.created_at) >= startDate && new Date(t.created_at) <= endDate
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
  return filteredTweets;
};
