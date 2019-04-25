import React, { useState } from "react";
import NavBar from "./NavBar";
import Menu from "./Menu";

const mapBaseStyle = {
  height: "100vh",
  width: "100%",
};

const mapStyle = visible =>
  visible
    ? mapBaseStyle
    : {
        position: "absolute",
        left: "-100%",
        ...mapBaseStyle,
      };

const MobileApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  return (
    <div>
      <h1>Mobile App</h1>
      {isOpen && <Menu />}
      <div className="col-sm-7" style={mapStyle(!isOpen)} id="map" />
      <NavBar setIsOpen={toggleIsOpen} />
    </div>
  );
};

export default MobileApp;
