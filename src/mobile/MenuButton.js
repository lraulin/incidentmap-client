import React from "react";

const Line = ({ color }) => (
  <div
    style={{
      width: "35px",
      height: "5px",
      backgroundColor: color,
      margin: "6px 0",
    }}
  />
);

const MenuButton = ({ color, backgroundColor, onClick }) => {
  return (
    <button style={{ backgroundColor, border: "none" }} onClick={onClick}>
      <Line color={color} />
      <Line color={color} />
      <Line color={color} />
    </button>
  );
};

export default MenuButton;
