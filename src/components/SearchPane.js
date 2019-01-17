import React from "react";
import incidentTypes from "../utilities/incidents";
import Calendar from "./Calendar";
import Checkbox from "./Checkbox";
import { filter } from "rsvp";

const containerStyle = {
  textAlign: "left"
};

const SearchPane = ({
  filteredTweets,
  toggleCheckBox,
  filterSettings,
  setFilterSettings
}) => {
  return (
    <div style={containerStyle}>
      <strong>Incident Type</strong>
      <br />
      <button
        className="btn btn-primary btn-sm"
        name="selectNone"
        onClick={() => {
          Object.keys(filterSettings.incidentTypes).forEach(
            k => (filterSettings.incidentTypes[k] = false)
          );
          setFilterSettings(filterSettings);
        }}
      >
        None
      </button>
      <button
        className="btn btn-primary btn-sm"
        name="selectAll"
        onClick={() => {
          Object.keys(filterSettings.incidentTypes).forEach(
            k => (filterSettings.incidentTypes[k] = true)
          );
          setFilterSettings(filterSettings);
        }}
      >
        All
      </button>
      <br />
      {incidentTypes.map(item => (
        <React.Fragment key={item.id}>
          <label>
            <Checkbox
              type="checkbox"
              name={item.id}
              checked={filterSettings.incidentTypes[item.id]}
              toggleCheckBox={toggleCheckBox}
            />
            {item.displayName}
          </label>
          <br />
        </React.Fragment>
      ))}
      <strong>Filter by Date</strong>
      <Calendar
        startDate={filterSettings.startDate}
        endDate={filterSettings.endDate}
        handleChangeDate={([startDate, endDate]) => {
          setFilterSettings({ ...filterSettings, startDate, endDate });
        }}
      />
      <br />
      <label htmlFor="text">
        <strong>Filter by Keywords</strong>
      </label>
      <input
        type="search"
        name="text"
        value={filterSettings.text}
        onChange={e => {
          setFilterSettings({ ...filterSettings, text: e.target.value });
        }}
      />
      <br />
      <button
        className="btn btn-primary"
        name="filter"
        onClick={() => filteredTweets()}
      >
        Filter
      </button>
      <br />
    </div>
  );
};

export default SearchPane;
