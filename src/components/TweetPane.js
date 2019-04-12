import React from "react";
import TweetEmbed from "react-tweet-embed";
import ReactScrollbar from "react-scrollbar";
import { connect } from "react-redux";

const myScrollbar = {
  // width: 400,
  height: 850,
};

const mapStateToProps = state => ({
  selectedMarkerIds: state.selectedMarkerIds,
});

const TweetPane = ({ selectedMarkerIds }) => {
  const tweetsOrMessage = () => {
    if (!selectedMarkerIds || selectedMarkerIds.length === 0) {
      return <p>Click on a marker to see Tweet(s).</p>;
    } else {
      return selectedMarkerIds.map(tweetId => (
        <TweetEmbed id={tweetId} key={tweetId} />
      ));
    }
  };
  return (
    <ReactScrollbar style={myScrollbar}>{tweetsOrMessage()}</ReactScrollbar>
  );
};

export default connect(mapStateToProps)(TweetPane);
