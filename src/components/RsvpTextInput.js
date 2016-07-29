import React, {PropTypes} from "react";

const RsvpTextInput = ({label, value, placeholder, onInputChange}) => {
  return(
    <fieldset className="form-group">
      <label>{label}</label>
      <input type="text" className="form-control" value={value} placeholder={placeholder} onChange={onInputChange}/>
    </fieldset>
  );
};

RsvpTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default RsvpTextInput;
