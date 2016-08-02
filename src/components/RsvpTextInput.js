import React, {PropTypes} from "react";
import classNames from 'classnames';

const RsvpTextInput = ({label, value, id, onInputChange}) => {
  const divClassname = classNames('input-field', 'col', 's6');

  return(
    <div className={divClassname}>
      <input type="text" value={value} id={id} onChange={onInputChange}/>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

RsvpTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default RsvpTextInput;
