import React, { useState } from "react";
import DatePicker from "react-mobile-datepicker";
import { formatDate } from "../utils";

const today = new Date();

const dateConfig = {
  month: {
    format: "MM",
    caption: "Mon",
    step: 1,
  },
  date: {
    format: "DD",
    caption: "Day",
    step: 1,
  },
  year: {
    format: "YYYY",
    caption: "Year",
    step: 1,
  },
};

const DateSelector = ({ date, setDate, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const text = title + (date ? formatDate(date) : "All");
  return (
    <>
      <button
        className="btn btn-info"
        onClick={() => setIsOpen(true)}
        style={{ width: "100%", margin: ".2em 0" }}
      >
        {text}
      </button>

      <DatePicker
        value={date || today}
        isOpen={isOpen}
        onSelect={time => {
          setDate(time);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        max={today}
        confirmText={"OK"}
        cancelText={"Cancel"}
        dateConfig={dateConfig}
        headerFormat={`MM/DD/YYYY`}
        theme={"android-dark"}
      />
    </>
  );
};

export default DateSelector;
