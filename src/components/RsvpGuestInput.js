import React, {PropTypes} from 'react';
import RsvpTextInput from './RsvpTextInput';
import {FIRST_NAME_LABEL, FIRST_NAME_KEY, LAST_NAME_LABEL, LAST_NAME_KEY} from '../constants/formConstants';

const RsvpGuestInput = ({onGuestInputChange, onGuestDeleteClick, id, guest}) => {
  const onInputChange = (key, e) => {
    onGuestInputChange(id,
      {
        ...guest,
        [key]: e.target.value
      }
    );
  };
  return (
    <div>
      <RsvpTextInput label={FIRST_NAME_LABEL} value={guest.firstName} placeholder="First Name" onInputChange={onInputChange.bind(undefined, FIRST_NAME_KEY)}/>
      <RsvpTextInput label={LAST_NAME_LABEL} value={guest.lastName} placeholder="Last Name" onInputChange={onInputChange.bind(undefined, LAST_NAME_KEY)}/>
      <button className="btn btn-danger" onClick={onGuestDeleteClick.bind(undefined, id)}>Remove Guest</button>
    </div>
  );
};

RsvpGuestInput.propTypes = {
  onGuestInputChange: PropTypes.func.isRequired,
  onGuestDeleteClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  guest: PropTypes.object.isRequired
};

export default RsvpGuestInput;
