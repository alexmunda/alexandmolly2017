import React, {PropTypes} from 'react';
import RsvpTextInput from './RsvpTextInput';
import {
  FIRST_NAME_ID,
  FIRST_NAME_KEY,
  FIRST_NAME_LABEL,
  LAST_NAME_ID,
  LAST_NAME_KEY,
  LAST_NAME_LABEL
} from '../constants/formConstants';

const RsvpGuestInput = ({onGuestInputChange, onGuestDeleteClick, guestId, guest}) => {
  const onInputChange = (key, e) => {
    onGuestInputChange(guestId, {
      ...guest,
      [key]: e.target.value
    });
  };

  return (
    <div>
      <RsvpTextInput label={FIRST_NAME_LABEL} value={guest.firstName} id={FIRST_NAME_ID} onInputChange={onInputChange.bind(undefined, FIRST_NAME_KEY)}/>
      <RsvpTextInput label={LAST_NAME_LABEL} value={guest.lastName} id={LAST_NAME_ID} onInputChange={onInputChange.bind(undefined, LAST_NAME_KEY)}/>
      <button className="btn btn-danger" onClick={onGuestDeleteClick.bind(undefined, guestId)}>Remove Guest</button>
    </div>
  );
};

RsvpGuestInput.propTypes = {
  onGuestInputChange: PropTypes.func.isRequired,
  onGuestDeleteClick: PropTypes.func.isRequired,
  guestId: PropTypes.number.isRequired,
  guest: PropTypes.object.isRequired
};

export default RsvpGuestInput;
