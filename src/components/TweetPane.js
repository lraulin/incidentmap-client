import React from "react";
import TweetEmbed from "react-tweet-embed";
import ReactScrollbar from "react-scrollbar";

const myScrollbar = {
  // width: 400,
  height: 850,
};

const TweetPane = ({ filteredTweets, ...props }) => {
  return (
    <ReactScrollbar style={myScrollbar}>
      {filteredTweets &&
        filteredTweets
          .reverse()
          .map(tweet => <TweetEmbed id={tweet.id_str} key={tweet.id_str} />)}
    </ReactScrollbar>
  );
};

export default TweetPane;
