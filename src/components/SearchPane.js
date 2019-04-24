import React from "react";
import DatePicker from "react-datepicker";
import Checkbox from "./Checkbox";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { setFilter, resetFilter } from "../redux/actions";

const today = new Date();

const mapStateToProps = state => ({
  filterSettings: {
    text: state.filterSettings.text,
    startDate: state.filterSettings.startDate,
    endDate: state.filterSettings.startDate,
    incidentTypes: {
      fatalCrash: state.filterSettings.incidentTypes.fatalCrash,
      pedestrianCrash: state.filterSettings.incidentTypes.pedestrianCrash,
      cyclistCrash: state.filterSettings.incidentTypes.cyclistCrash,
      truckCrash: state.filterSettings.incidentTypes.truckCrash,
      busCrash: state.filterSettings.incidentTypes.busCrash,
      transitCrash: state.filterSettings.incidentTypes.transitCrash,
      transSuicide: state.filterSettings.incidentTypes.transSuicide,
      pipeline: state.filterSettings.incidentTypes.pipeline,
      hazmat: state.filterSettings.incidentTypes.hazmat,
      rail: state.filterSettings.incidentTypes.rail,
      road: state.filterSettings.incidentTypes.road,
      unsafe: state.filterSettings.incidentTypes.unsafe,
      drone: state.filterSettings.incidentTypes.drone,
    },
  },
  incidentTypeList: Object.keys(state.filterSettings.incidentTypes),
});

const mapDispatchToProps = dispatch => ({
  setFilterSettings: filter => dispatch(setFilter(filter)),
  resetFilterSettings: () => dispatch(resetFilter()),
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
  resetFilterSettings,
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
          maxDate={today}
          title={"After"}
        />
        <br />
        Before
        <DatePicker
          selected={filterSettings.endDate}
          onChange={endDate =>
            setFilterSettings({ ...filterSettings, endDate })
          }
          maxDate={today}
          title={"Before"}
        />
        <br />
        <br />
      </section>
      <section id="textFilterSection">
        <label htmlFor="text">
          <strong>Filter by Keywords</strong>
        </label>
        <br />
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
          onClick={resetFilterSettings}
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
