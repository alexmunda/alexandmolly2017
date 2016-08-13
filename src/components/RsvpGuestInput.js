import React, {PropTypes} from 'react';
import classNames from 'classnames';
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

  const nameInputCLassName = classNames('input-field', 'col', 's5');
  const buttonContainerClassName = classNames('col', 's2');
  const removeButtonClassName = classNames('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'red', 'align-left', 'remove-btn');
  const removeIconClassName = classNames('material-icons');

  return (
    <div>
      <RsvpTextInput label={FIRST_NAME_LABEL} value={guest.firstName} hasErrors={guest.errors.firstName != undefined} id={FIRST_NAME_ID} onInputChange={onInputChange.bind(undefined, FIRST_NAME_KEY)} styles={nameInputCLassName}/>
      <RsvpTextInput label={LAST_NAME_LABEL} value={guest.lastName} hasErrors={guest.errors.lastName != undefined} id={LAST_NAME_ID} onInputChange={onInputChange.bind(undefined, LAST_NAME_KEY)} styles={nameInputCLassName}/>
      <div className={buttonContainerClassName}>
        <button className={removeButtonClassName} onClick={onGuestDeleteClick.bind(undefined, guestId)}>
          <i className={removeIconClassName}>close</i>
          Add Guest
        </button>
      </div>
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
