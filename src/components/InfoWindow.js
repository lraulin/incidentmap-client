import React from "react";
import TweetEmbed from "react-tweet-embed";
import PropTypes from "prop-types";

const InfoWindow = ({ tweetIds, ...props }) => (
  <>
    {tweetIds.map(id => (
      <TweetEmbed id={id} key={id} />
    ))}
  </>
);

InfoWindow.propTypes = {
  tweetIds: PropTypes.arrayOf(PropTypes.string),
};

export default InfoWindow;
