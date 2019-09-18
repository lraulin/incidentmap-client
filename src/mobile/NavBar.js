import React from "react";
import slugify from "slugify";
import MenuButton from "./MenuButton";
import undoIcon from "../images/undo-arrow.svg";
import { connect } from "react-redux";
import { resetFilter } from "../redux/actions";

const backgroundColor = "#333";

const ulStyle = {
  listStyleType: "none",
  margin: 0,
  padding: "1em",
  overflow: "hidden",
  backgroundColor,
  position: "fixed",
  bottom: 0,
  width: "100%",
};

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(resetFilter()),
});

const NavBar = ({ menuButton, isOpen, setIsOpen, reset }) => {
  return (
    <div>
      <ul style={ulStyle}>
        <li style={{ float: "left", color: "white" }}>
          <h3>Incident Map</h3>
        </li>
        {menuButton && (
          <li style={{ float: "right" }}>
            <MenuButton
              color={"white"}
              backgroundColor={backgroundColor}
              onClick={setIsOpen}
            />
          </li>
        )}
        {isOpen && (
          <li style={{ float: "right" }}>
            <button onClick={() => reset()}>
              <img src={undoIcon} width="49" height="42" color="white" alt="" />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(NavBar);
