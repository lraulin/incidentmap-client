import React, { useState, useEffect } from "react";
import incidentTypes from "../utilities/incidents";
import Calendar from "./Calendar";
import Checkbox from "./Checkbox";

const containerStyle = {
  textAlign: "left"
  // height: "100%"
};

const SearchPane = ({
  setFilter,
  toggleCheckBox,
  filter,
  changeFilterText
}) => {
  const [mounted, setMounted] = useState(false);
  const selectAll = bool => {
    //
  };

  const handleClick = e => {
    console.log(e.target);
    switch (e.target.name) {
      case "selectAll":
        selectAll(true);
        break;
      case "selectNone":
        selectAll(false);
        break;
      case "filter":
        filter();
        break;
      default:
        throw new Error(`No handler for click event ${e.target.name}`);
    }
  };

  const handleChangeDate = ([startDate, endDate]) => {
    filter.startDate = startDate;
    filter.endDate = endDate;
    setFilter(filter);
  };

  return (
    <div style={containerStyle}>
      <strong>Incident Type</strong>
      {/* <br />
        <button
          className="btn btn-primary btn-sm"
          name="selectNone"
          onClick={this.handleClick}
        >
          None
        </button>
        <button
          className="btn btn-primary btn-sm"
          name="selectAll"
          onClick={this.props.checkAll(true)}
        >
          All
        </button> */}
      <br />
      {incidentTypes.map(item => (
        <React.Fragment key={item.id}>
          <label>
            <Checkbox
              type="checkbox"
              name={item.id}
              checked={filter.incidentTypes[item.id]}
              toggleCheckBox={toggleCheckBox}
            />
            {item.displayName}
          </label>
          <br />
        </React.Fragment>
      ))}
      <strong>Filter by Date</strong>
      <Calendar
        handleChangeDate={handleChangeDate}
        startDate={filter.startDate}
        endDate={filter.endDate}
      />
      <br />
      <label htmlFor="text">
        <strong>Filter by Keywords</strong>
      </label>
      <input
        type="search"
        name="text"
        value={filter.text}
        onChange={e => changeFilterText(e.target.value)}
      />
      <br />
      <button className="btn btn-primary" name="filter" onClick={handleClick}>
        Filter
      </button>
      <br />
    </div>
  );
};

export default SearchPane;
