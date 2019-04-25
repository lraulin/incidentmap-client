import React from "react";
import slugify from "slugify";
import MenuButton from "./MenuButton";

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

const NavBar = ({ setIsOpen }) => {
  return (
    <div>
      <ul style={ulStyle}>
        <li style={{ float: "left", color: "white" }}>
          <h3>Incident Map</h3>
        </li>
        <li style={{ float: "right" }}>
          <MenuButton
            color={"white"}
            backgroundColor={backgroundColor}
            onClick={setIsOpen}
          />
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
