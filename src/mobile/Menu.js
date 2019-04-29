import React, { useState } from "react";
import TypeSelectors from "./TypeSelectors";
import DateSelector from "./DateSelector";
import { connect } from "react-redux";
import { setFilterStartDate, setFilterEndDate } from "../redux/actions";

const mapStateToProps = state => ({
  startDate: state.filterSettings.startDate,
  endDate: state.filterSettings.endDate,
});

const mapDispatchToProps = dispatch => ({
  setStartDate: date => dispatch(setFilterStartDate(date)),
  setEndDate: date => dispatch(setFilterEndDate(date)),
});

const Menu = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const [text, setText] = useState("");
  return (
    <>
      <TypeSelectors />
      <DateSelector
        date={startDate}
        setDate={date => setStartDate(date)}
        title={"From: "}
      />
      <DateSelector
        date={endDate}
        setDate={date => setEndDate(date)}
        title={"To: "}
      />
      <div className="form-group">
        <label htmlFor="filterText">Filter by Keyword</label>
        <input
          type="text"
          className="form-control"
          id="filterText"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
