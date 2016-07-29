import React, {PropTypes} from 'react';

const RsvpRadioInput = ({label, value, shouldBeChecked, onInputChange}) => {
  return (
    <div className="radio">
      <label>
        <input type="radio" className="optionsRadios" value={value} checked={shouldBeChecked} onChange={onInputChange}/>
        {label}
      </label>
    </div>
  );
};

RsvpRadioInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  shouldBeChecked: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default RsvpRadioInput;
