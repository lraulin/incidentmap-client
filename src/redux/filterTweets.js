import { compose, filter, into, uniqBy } from "ramda";

// Take object containing key/boolean value pairs and return array of the keys
// with true values
const getSelectedTypes = booleanDict =>
  Object.keys(booleanDict).filter(key => booleanDict[key]);

const filterTweets = ({ filterSettings, tweetIdList, tweetDict }) => {
  if (!tweetIdList.length) return [];
  const { text, startDate, endDate } = filterSettings;
  const types = getSelectedTypes(filterSettings.incidentTypes);

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
};

export default filterTweets;
