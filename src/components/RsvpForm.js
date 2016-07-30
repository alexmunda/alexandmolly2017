import React, {PropTypes} from 'react';
import RsvpTextInput from './RsvpTextInput';
import RsvpRadioInput from './RsvpRadioInput';
import RsvpGuestInput from './RsvpGuestInput';
import {
  GUEST_TEMPLATE,
  FIRST_NAME_LABEL,
  FIRST_NAME_KEY,
  LAST_NAME_LABEL,
  LAST_NAME_KEY,
  ATTENDING_LABEL,
  ATTENDING_KEY,
  NOT_ATTENDING_LABEL
} from '../constants/formConstants';

const RsvpForm = ({rsvp, onChange, onSubmit}) => {
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

  return (
    <div className="col-md-4 col-md-offset-4">
      <form className="contactForm" onSubmit={onRsvpSubmit} noValidate="true">
        <RsvpTextInput label={FIRST_NAME_LABEL} value={rsvp.firstName} placeholder="First Name" onInputChange={onInputChange.bind(undefined, FIRST_NAME_KEY)}/>
        <RsvpTextInput label={LAST_NAME_LABEL} value={rsvp.lastName} placeholder="Last Name" onInputChange={onInputChange.bind(undefined, LAST_NAME_KEY)}/>
        <fieldset className="form-group">
          <RsvpRadioInput label={ATTENDING_LABEL} value={'true'} shouldBeChecked={rsvp.attending === 'true'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
          <RsvpRadioInput label={NOT_ATTENDING_LABEL} value={'false'} shouldBeChecked={rsvp.attending === 'false'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
        </fieldset>
        <fieldset className="form-group">
          <label>Guests</label>
          {rsvp.guests.map((guest, index) => {
            return(<RsvpGuestInput onGuestInputChange={onGuestInputChange} onGuestDeleteClick={onGuestDeleteClick} id={index} guest={guest} key={index}/>);
          })}
          <br></br>
          <button className="btn btn-info" onClick={onAddGuestClick}>Add Guest</button>
        </fieldset>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

RsvpForm.propTypes = {
  rsvp: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default RsvpForm;
