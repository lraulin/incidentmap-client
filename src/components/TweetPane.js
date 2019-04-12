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
  return (
    <ReactScrollbar style={myScrollbar}>
      {selectedMarkerIds &&
        selectedMarkerIds.map(tweetId => (
          <TweetEmbed id={tweetId} key={tweetId} />
        ))}
    </ReactScrollbar>
  );
};

export default connect(mapStateToProps)(TweetPane);
