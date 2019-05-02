import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import NavBar from "./NavBar";
import Menu from "./Menu";
import { updateTweets } from "../redux/actions";
import mockDatabase from "../incident-report-map-export";
import { getData } from "../danDb";

const mapBaseStyle = {
  height: "100vh",
  width: "100%",
};

const mapDispatchToProps = dispatch => ({
  updateTweets: tweets => dispatch(updateTweets(tweets)),
});

const mapStyle = visible =>
  visible
    ? mapBaseStyle
    : {
        position: "absolute",
        left: "-100%",
        ...mapBaseStyle,
      };

const MobileApp = ({ updateTweets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    getData(updateTweets);
  }, []);

  return (
    <div>
      {isOpen && <Menu />}
      <div className="col-sm-7" style={mapStyle(!isOpen)} id="map" />
      <NavBar isOpen={isOpen} setIsOpen={toggleIsOpen} />
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(MobileApp);
