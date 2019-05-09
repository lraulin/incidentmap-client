import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import NavBar from "./NavBar";
import Menu from "./Menu";
import { updateTweets } from "../redux/actions";
import { getData } from "../danDb";
import DotMap from "./DotMap";

const mapDispatchToProps = dispatch => ({
  updateTweets: tweets => dispatch(updateTweets(tweets)),
});

const MobileApp = ({ updateTweets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    getData(updateTweets);
  }, []);

  return (
    <div>
      <div id="message" />
      {isOpen && <Menu />}
      <DotMap hidden={isOpen} />
      <NavBar isOpen={isOpen} setIsOpen={toggleIsOpen} />
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(MobileApp);
