const TEN_MINUTES = 600000;
const ONE_MINUTE = 60000;

const { getSessionTweetCount } = require("./tweetStreamer");

const showCountAndExit = () => {
  console.log("!!!!!!Time's up!!!!!!!");
  console.log(`Tweets saved: ${getSessionTweetCount()}`);
  process.exit();
};

let minutes = 0;

const countMinutes = () => {
  minutes++;
  console.log(minutes);
};

setTimeout(showCountAndExit, TEN_MINUTES);
