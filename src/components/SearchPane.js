import React from "react";
import incidentTypes from "../data/incidents";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "./Checkbox";

const containerStyle = {
  textAlign: "left"
};
const buttonStyle = {
  letterSpacing: ".2em",
  marginRight: "10px",
  width: 75
};

const SearchPane = ({
  filteredTweets,
  toggleCheckBox,
  filterSettings,
  setFilterSettings
}) => {
  return (
    <div style={containerStyle}>
      <section id="typeFilterSection" style={{ marginBottom: 10 }}>
        <strong>Incident Type</strong>
        <br />
        <button
          className="btn btn-outline-primary btn-sm"
          name="selectAll"
          style={buttonStyle}
          onClick={() => {
            Object.keys(filterSettings.incidentTypes).forEach(
              k => (filterSettings.incidentTypes[k] = true)
            );
            setFilterSettings(filterSettings);
          }}
        >
          All
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          name="selectNone"
          style={buttonStyle}
          onClick={() => {
            Object.keys(filterSettings.incidentTypes).forEach(
              k => (filterSettings.incidentTypes[k] = false)
            );
            setFilterSettings(filterSettings);
          }}
        >
          None
        </button>
        <br />
        {incidentTypes.map(item => (
          <React.Fragment key={item.id}>
            <Checkbox
              type="checkbox"
              name={item.id}
              checked={filterSettings.incidentTypes[item.id]}
              toggleCheckBox={toggleCheckBox}
              displayName={item.displayName}
            />
            <br />
          </React.Fragment>
        ))}
      </section>
      <section id="dateFilterSection">
        <strong>Filter by Date</strong>
        <br />
        After
        <DatePicker
          selected={filterSettings.startDate}
          onChange={startDate =>
            setFilterSettings({ ...filterSettings, startDate })
          }
        />
        Before
        <DatePicker
          selected={filterSettings.endDate}
          onChange={endDate =>
            setFilterSettings({ ...filterSettings, endDate })
          }
        />
        <br />
        <br />
      </section>
      <section id="textFilterSection">
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
      </section>
    </div>
  );
};

export default SearchPane;
