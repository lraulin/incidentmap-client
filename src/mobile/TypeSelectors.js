import React from "react";
import { connect } from "react-redux";
import { setFilter, resetFilter } from "../redux/actions";
import TypeButton from "./TypeButton";

const activeStyle = "btn-primary";
const inactiveStyle = "btn-default";

const mapStateToProps = state => ({
  filterSettings: state.filterSettings,
  incidentTypeList: Object.keys(state.filterSettings.incidentTypes),
});

const mapDispatchToProps = dispatch => ({
  setFilterSettings: filter => dispatch(setFilter(filter)),
  resetFilterSettings: () => dispatch(resetFilter()),
});

const buttonIsPressedStyle = pressed =>
  pressed ? {} : { borderStyle: "inset" };

const TypeSelectors = ({
  incidentTypeList,
  filterSettings,
  setFilterSettings,
  resetFilterSettings,
}) => {
  const selectAll = () => {
    incidentTypeList.forEach(type => {
      filterSettings.incidentTypes[type] = true;
      setFilterSettings(filterSettings);
    });
  };
  const selectNone = () => {
    incidentTypeList.forEach(type => {
      filterSettings.incidentTypes[type] = false;
      setFilterSettings(filterSettings);
    });
  };
  const toggleTypeFilter = type => {
    filterSettings.incidentTypes[type] = !filterSettings.incidentTypes[type];
    setFilterSettings(filterSettings);
  };
  return (
    <div>
      <button
        className={"btn btn-danger"}
        onClick={selectNone}
        style={{ width: "50%" }}
      >
        None
      </button>
      <button
        className={"btn btn-success"}
        onClick={selectAll}
        style={{ width: "50%" }}
      >
        All
      </button>
      <br />
      {incidentTypeList.map(type => (
        <TypeButton
          key={type}
          type={type}
          selected={filterSettings.incidentTypes[type]}
          onClick={() => toggleTypeFilter(type)}
        />
      ))}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeSelectors);
