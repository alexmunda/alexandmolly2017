import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RsvpTextInput from './RsvpTextInput';
import RsvpRadioInput from './RsvpRadioInput';
import RsvpGuestInput from './RsvpGuestInput';
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
  const onInputChange = (key, e) => {
    onChange({
      ...rsvp,
      [key]: e.target.value
    });
  };

  const onAddGuestClick = (e) => {
    e.preventDefault();
    const newGuests = [
      ...rsvp.guests,
      GUEST_TEMPLATE
    ];
    onChange({
      ...rsvp,
      guests: newGuests
    });
  };

  const onGuestDeleteClick = (id, e) => {
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

  const onGuestInputChange = (id, guest) => {
    const newGuests = [
      ...rsvp.guests.slice(0, id),
      guest,
      ...rsvp.guests.slice(id + 1)
    ];
    onChange({
      ...rsvp,
      guests: newGuests
    });
  };

  const onRsvpSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const onBlur = () => {
    return () => validateRsvp(rsvp);
  };

  const rowClassName = classNames('row');
  const outerDivClassName = classNames('col', 's12');
  const nameInputCLassName = classNames('input-field', 'col', 's5');
  const guestsDivClassName = classNames({
    'row': true,
    'hidden': rsvp.guests.length < 1
  });
  const addGuestButtonClassName = classNames('waves-effect', 'waves-dark', 'btn-flat');
  const sendIconClassName = classNames('material-icons', 'right');
  const submitButtonClassName = classNames('waves-effect', 'waves-dark', 'btn-flat');

  return (
    <div className={rowClassName}>
      <div className={outerDivClassName}>
        <form onSubmit={onRsvpSubmit} noValidate="true">
          <div className={rowClassName}>
            <RsvpTextInput label={FIRST_NAME_LABEL} value={rsvp.firstName} hasErrors={rsvp.errors.firstName !== undefined} id={FIRST_NAME_ID} onInputChange={onInputChange.bind(undefined, FIRST_NAME_KEY)} styles={nameInputCLassName} onBlur={onBlur()}/>
            <RsvpTextInput label={LAST_NAME_LABEL} value={rsvp.lastName} hasErrors={rsvp.errors.lastName !== undefined} id={LAST_NAME_ID} onInputChange={onInputChange.bind(undefined, LAST_NAME_KEY)} styles={nameInputCLassName}/>
          </div>
          <div className={rowClassName}>
            <label>Please let us know if you will be attending.</label>
            <RsvpRadioInput label={ATTENDING_LABEL} value={'true'} id={ATTENDING_ID} shouldBeChecked={rsvp.attending === 'true'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
            <RsvpRadioInput label={NOT_ATTENDING_LABEL} value={'false'} id={NOT_ATTENDING_ID} shouldBeChecked={rsvp.attending === 'false'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
          </div>
          <div className={guestsDivClassName}>
            <label>Guests</label>
            {rsvp.guests.map((guest, index) => {
              return (<RsvpGuestInput onGuestInputChange={onGuestInputChange} onGuestDeleteClick={onGuestDeleteClick} guestId={index} guest={guest} key={index}/>);
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
