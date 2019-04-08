import React from "react";
import TweetEmbed from "react-tweet-embed";
import { className } from "postcss-selector-parser";
import PropTypes from "prop-types";

const InfoWindow = ({ tweet, ...props }) => {
  if (!("entities" in tweet)) {
    tweet.entities = { urls: [] };
  } else if (!("urls" in tweet.entities)) {
    tweet.entities.urls = [];
  }
  return <TweetEmbed id={tweet.id_str} key={tweet.id_str} />;
};

InfoWindow.propTypes = {
  tweet: PropTypes.object,
};

export default InfoWindow;
