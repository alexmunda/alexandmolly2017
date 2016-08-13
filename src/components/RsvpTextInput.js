import React, {PropTypes} from "react";
import classNames from 'classnames';

const RsvpTextInput = ({label, value, id, onInputChange, onBlur, hasErrors, styles}) => {
  const invalidClassName = classNames({
    invalid : hasErrors
  });

  return(
    <div className={styles}>
      <input className={invalidClassName} type="text" value={value} id={id} onChange={onInputChange} onBlur={onBlur}/>
      <label className={invalidClassName} htmlFor={id}>{label}</label>
    </div>
  );
};

RsvpTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  hasErrors: PropTypes.bool.isRequired,
  styles: PropTypes.string.isRequired
};

export default RsvpTextInput;
