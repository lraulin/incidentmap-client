import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({
  type = "checkbox",
  name = "",
  checked = false,
  toggleCheckBox
}) => {
  return (
    <input
      type={type}
      name={name}
      checked={checked}
      onChange={() => toggleCheckBox(name)}
      key={"input_" + name}
    />
  );
};

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  toggleCheckBox: PropTypes.func.isRequired
};

export default Checkbox;
