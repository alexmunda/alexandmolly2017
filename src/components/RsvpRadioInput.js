import React, {PropTypes} from 'react';
import classNames from 'classnames';

const RsvpRadioInput = ({label, value, shouldBeChecked, onInputChange, id}) => {
  const radioClassname = classNames('with-gap');
  
  return (
    <p>
      <input type="radio" className={radioClassname} id={id} value={value} checked={shouldBeChecked} onChange={onInputChange}/>
      <label htmlFor={id}>{label}</label>
    </p>
  );
};

RsvpRadioInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  shouldBeChecked: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default RsvpRadioInput;
