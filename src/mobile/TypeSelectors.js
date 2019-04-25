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
  const toggleTypeFilter = type => {
    filterSettings.incidentTypes[type] = !filterSettings.incidentTypes[type];
    setFilterSettings(filterSettings);
  };
  return (
    <div>
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
