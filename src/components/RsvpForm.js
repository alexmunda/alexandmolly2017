import React, {PropTypes} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import RsvpTextInput from './RsvpTextInput';
import RsvpRadioInput from './RsvpRadioInput';
import {
  ATTENDING_ID,
  ATTENDING_KEY,
  ATTENDING_LABEL,
  FIRST_NAME_ID,
  FIRST_NAME_KEY,
  FIRST_NAME_LABEL,
  GUEST_TEMPLATE,
  LAST_NAME_ID,
  LAST_NAME_KEY,
  LAST_NAME_LABEL,
  NOT_ATTENDING_ID,
  NOT_ATTENDING_LABEL
} from '../constants/formConstants';

const RsvpForm = ({rsvp, onChange, onSubmit, validateRsvp}) => {
  const onInputChange = (guestId, key, e) => {
    const guest = rsvp.guests[guestId];

    const newGuest = {
      ...guest,
      [key]: e.target.value
    };

    const newGuests = [
      ...rsvp.guests.slice(0, guestId),
      newGuest,
      ...rsvp.guests.slice(guestId + 1)
    ];

    onChange({
      ...rsvp,
      guests: newGuests
    });
  };

  const onNameChange = _.curry(onInputChange);

  const onAddGuestClick = (e) => {
    e.preventDefault();
    if (disableAddGuestButton())
      return;
    const newGuests = [
      ...rsvp.guests,
      GUEST_TEMPLATE
    ];
    onChange({
      ...rsvp,
      guests: newGuests
    });
  };

  const onGuestDelete = (id, e) => {
    e.preventDefault();
    const newGuests = [
      ...rsvp.guests.slice(0, id),
      ...rsvp.guests.slice(id + 1)
    ];
    onChange({
      ...rsvp,
      guests: newGuests
    });
  };

  const onGuestDeleteClick = _.curry(onGuestDelete);

  const onRsvpSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const onBlur = (key) => {
    return () => {
      const validatedRsvp = validateRsvp(rsvp);
      console.log(validatedRsvp, key);
    };
  };

  const disableAddGuestButton = () => {
    if (rsvp.guests.length > 0) {
      const lastGuest = rsvp.guests[rsvp.guests.length - 1];
      const isEmpty = lastGuest.firstName === "" || lastGuest.lastName === "";
      return isEmpty || lastGuest.errors.firstName != undefined || lastGuest.errors.lastName != undefined;
    }
    return false;
  };

  const rowClassName = classNames('row');
  const outerDivClassName = classNames('col', 's12');
  const nameInputClassName = classNames('input-field', 'col', 's5');
  const guestsDivClassName = classNames({
    'row': true,
    'hidden': rsvp.guests.length < 1
  });
  const addGuestButtonClassName = classNames({'waves-effect': true, 'waves-dark': true, 'btn-flat': true, 'disabled': disableAddGuestButton()});
  const sendIconClassName = classNames('material-icons', 'right');
  const submitButtonClassName = classNames('waves-effect', 'waves-dark', 'btn-flat');
  const buttonContainerClassName = classNames('col', 's2');
  const removeButtonClassName = classNames('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'red', 'align-left', 'remove-btn');
  const removeIconClassName = classNames('material-icons');

  return (
    <div className={rowClassName}>
      <div className={outerDivClassName}>
        <form onSubmit={onRsvpSubmit} noValidate="true">
          <div className={rowClassName}>
            <RsvpTextInput label={FIRST_NAME_LABEL} value={rsvp.guests[0].firstName} hasErrors={rsvp.guests[0].errors.firstName !== undefined} id={FIRST_NAME_ID} onInputChange={onNameChange(0, FIRST_NAME_KEY)} styles={nameInputClassName} onBlur={onBlur('firstName')}/>
            <RsvpTextInput label={LAST_NAME_LABEL} value={rsvp.guests[0].lastName} hasErrors={rsvp.guests[0].errors.lastName !== undefined} id={LAST_NAME_ID} onInputChange={onNameChange(0, LAST_NAME_KEY)} styles={nameInputClassName}/>
          </div>
          <div className={rowClassName}>
            <label>Please let us know if you will be attending.</label>
            <RsvpRadioInput label={ATTENDING_LABEL} value={'true'} id={ATTENDING_ID} shouldBeChecked={rsvp.attending === 'true'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
            <RsvpRadioInput label={NOT_ATTENDING_LABEL} value={'false'} id={NOT_ATTENDING_ID} shouldBeChecked={rsvp.attending === 'false'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
          </div>
          <div className={guestsDivClassName}>
            <label>Guests</label>
            {rsvp.guests.slice(1).map((guest, index) => {
              const guestId = index + 1;
              return (
                <div key={index}>
                  <RsvpTextInput label={FIRST_NAME_LABEL} value={guest.firstName} hasErrors={guest.errors.firstName != undefined} id={FIRST_NAME_ID} onInputChange={onNameChange(guestId, FIRST_NAME_KEY)} styles={nameInputClassName}/>
                  <RsvpTextInput label={LAST_NAME_LABEL} value={guest.lastName} hasErrors={guest.errors.lastName != undefined} id={LAST_NAME_ID} onInputChange={onNameChange(guestId, LAST_NAME_KEY)} styles={nameInputClassName}/>
                  <div className={buttonContainerClassName}>
                    <button className={removeButtonClassName} onClick={onGuestDeleteClick(guestId)}>
                      <i className={removeIconClassName}>close</i>
                      Add Guest
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={rowClassName}>
            <button className={addGuestButtonClassName} onClick={onAddGuestClick}>
              Add Guest
            </button>
          </div>
          <div className={rowClassName}>
            <button type="submit" className={submitButtonClassName}>
              Submit
              <i className={sendIconClassName}>send</i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RsvpForm.propTypes = {
  rsvp: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  validateRsvp: PropTypes.func.isRequired
};

export default RsvpForm;
