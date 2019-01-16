import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import PropTypes from "prop-types";

const Calendar = ({ handleChangeDate, startDate, endDate, ...props }) => (
  <>
    <DateRangePicker
      onChange={date => {
        if (date) return handleChangeDate(date);
        else handleChangeDate([null, null]);
      }}
      value={[startDate, endDate]}
    />
  </>
);

Calendar.propTypes = {
  handleChangeDate: PropTypes.func.isRequired,
  startDate: PropTypes.object,
  endDate: PropTypes.object
};

export default Calendar;
