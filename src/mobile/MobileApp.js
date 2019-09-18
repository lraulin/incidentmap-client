import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Breakpoint from "react-socks";
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

  const style = {
    display: "block",
    float: "left",
  };

  return (
    <div>
      <Breakpoint small down>
        {isOpen && <Menu />}
        <DotMap hidden={isOpen} />
        <NavBar menuButton={true} isOpen={isOpen} setIsOpen={toggleIsOpen} />
      </Breakpoint>
      <Breakpoint medium up>
        <div style={{ ...style, width: "20%" }}>
          <Menu />
        </div>
        <div style={{ ...style, width: "80%" }}>
          <DotMap hidden={false} />
        </div>
        <NavBar
          isOpen={false}
          setIsOpen={() => alert("This button should not be visible.")}
          menuButton={false}
        />
      </Breakpoint>
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(MobileApp);
