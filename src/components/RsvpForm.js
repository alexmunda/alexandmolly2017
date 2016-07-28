import React, {PropTypes} from 'react';

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
        <fieldset className="form-group">
          <label htmlFor="rsvpFirstName">{FIRST_NAME_LABEL}</label>
          <input type="text" className="form-control" value={props.rsvp.firstName} placeholder="First Name" onChange={onInputChange.bind(undefined, FIRST_NAME_KEY)}/>
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="rsvpLastName">{LAST_NAME_LABEL}</label>
          <input type="text" className="form-control" value={props.rsvp.lastName} placeholder="Last Name" onChange={onInputChange.bind(undefined, LAST_NAME_KEY)}/>
        </fieldset>
        <fieldset className="form-group">
          <div className="radio">
            <label>
              <input type="radio" className="optionsRadios" value={true} checked={props.rsvp.attending === 'true'} onChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
              {ATTENDING_LABEL}
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" className="optionsRadios" value={false} checked={props.rsvp.attending === 'false'} onChange={onInputChange.bind(undefined, ATTENDING_KEY)}/>
              {NOT_ATTENDING_LABEL}
            </label>
          </div>
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
