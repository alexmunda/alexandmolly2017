import React, {PropTypes} from 'react';
import RsvpTextInput from './RsvpTextInput';
import RsvpRadioInput from './RsvpRadioInput';

const FIRST_NAME_KEY = 'firstName';
const LAST_NAME_KEY = 'lastName';
const ATTENDING_KEY = 'attending';
const FIRST_NAME_LABEL = 'First Name';
const LAST_NAME_LABEL = 'Last Name';
const ATTENDING_LABEL = 'Accepts with pleasure';
const NOT_ATTENDING_LABEL = 'Declines with regret';


const RsvpForm = (props) => {
  const onInputChange = (key, e) => {
    props.onChange({
      ...props.rsvp,
      [key]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <div className="col-md-6 offset-3">
      <form className="contactForm" onSubmit={onSubmit} noValidate="true">
        <RsvpTextInput label={FIRST_NAME_LABEL} value={props.rsvp.firstName} placeholder="First Name" onInputChange={onInputChange.bind(undefined, FIRST_NAME_KEY)}/>
        <RsvpTextInput label={LAST_NAME_LABEL} value={props.rsvp.lastName} placeholder="Last Name" onInputChange={onInputChange.bind(undefined, LAST_NAME_KEY)}/>
        <fieldset className="form-group">
          <RsvpRadioInput label={ATTENDING_LABEL} value={'true'} shouldBeChecked={props.rsvp.attending === 'true'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
          <RsvpRadioInput label={NOT_ATTENDING_LABEL} value={'false'} shouldBeChecked={props.rsvp.attending === 'false'} onInputChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
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
