import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({
  type = "checkbox",
  name = "",
  checked = false,
  toggleCheckBox,
  displayName
}) => {
  return (
    <label style={{ margin: 0 }}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={() => toggleCheckBox(name)}
        key={"input_" + name}
        style={{ marginRight: "0.4em" }}
      />
      {displayName}
    </label>
  );
};

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  toggleCheckBox: PropTypes.func.isRequired
};

export default Checkbox;
