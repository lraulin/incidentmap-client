import React from "react";
import { camelToTitle } from "../utils";

const TypeButton = ({ selected, onClick, type }) => {
  return (
    <button
      className={`btn ${selected ? "btn-primary active" : "btn-default"}`}
      style={{ margin: ".2em", width: "48%" }}
      aria-pressed={selected}
      onClick={onClick}
    >
      {camelToTitle(type)}
    </button>
  );
};

export default TypeButton;
