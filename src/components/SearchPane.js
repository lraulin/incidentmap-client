import React from "react";
import DatePicker from "react-datepicker";
import Checkbox from "./Checkbox";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { setFilter } from "../redux/actions";

const mapStateToProps = state => ({
  filterSettings: {
    text: state.visibilityFilter.text,
    startDate: state.visibilityFilter.startDate,
    endDate: state.visibilityFilter.startDate,
    incidentTypes: {
      fatalCrash: state.visibilityFilter.incidentTypes.fatalCrash,
      pedestrianCrash: state.visibilityFilter.incidentTypes.pedestrianCrash,
      cyclistCrash: state.visibilityFilter.incidentTypes.cyclistCrash,
      truckCrash: state.visibilityFilter.incidentTypes.truckCrash,
      busCrash: state.visibilityFilter.incidentTypes.busCrash,
      transitCrash: state.visibilityFilter.incidentTypes.transitCrash,
      transSuicide: state.visibilityFilter.incidentTypes.transSuicide,
      pipeline: state.visibilityFilter.incidentTypes.pipeline,
      hazmat: state.visibilityFilter.incidentTypes.hazmat,
      rail: state.visibilityFilter.incidentTypes.rail,
      road: state.visibilityFilter.incidentTypes.road,
      unsafe: state.visibilityFilter.incidentTypes.unsafe,
      drone: state.visibilityFilter.incidentTypes.drone,
    },
  },
  incidentTypeList: Object.keys(state.visibilityFilter.incidentTypes),
});

const mapDispatchToProps = dispatch => ({
  setFilterSettings: filter => dispatch(setFilter(filter)),
});

// Convert camelCase string to Title Case
const camelToTitle = stringValue => {
  stringValue = stringValue[0].toUpperCase() + stringValue.slice(1);
  return stringValue
    .replace(/([A-Z]+)/g, " $1")
    .replace(/([A-Z][a-z])/g, " $1");
};

const containerStyle = {
  textAlign: "left",
};

const buttonStyle = {
  letterSpacing: ".2em",
  marginRight: "10px",
  width: 75,
};

const SearchPane = ({
  filterSettings,
  setFilterSettings,
  incidentTypeList,
}) => {
  const toggleCheckBox = name => {
    filterSettings.incidentTypes[name] = !filterSettings.incidentTypes[name];
    setFilterSettings(filterSettings);
  };
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
            incidentTypeList.forEach(
              key => (filterSettings.incidentTypes[key] = true),
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
            incidentTypeList.forEach(
              key => (filterSettings.incidentTypes[key] = false),
            );
            setFilterSettings(filterSettings);
          }}
        >
          None
        </button>
        <br />
        {incidentTypeList.map(type => (
          <React.Fragment key={type}>
            <Checkbox
              type="checkbox"
              name={type}
              checked={filterSettings.incidentTypes[type]}
              toggleCheckBox={toggleCheckBox}
              displayName={camelToTitle(type)}
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
      </section>
      <section id="resetButtonSection">
        <button
          className="btn btn-danger"
          name="reset"
          onClick={() => setFilterSettings()}
        >
          Reset
        </button>
      </section>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPane);
