import React, {PropTypes} from 'react';

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
          <label htmlFor="rsvpFirstName">First Name</label>
          <input type="text" className="form-control" value={props.rsvp.firstName} placeholder="First Name" onChange={onInputChange.bind(undefined, 'firstName')}/>
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="rsvpLastName">Last Name</label>
          <input type="text" className="form-control" value={props.rsvp.lastName} placeholder="Last Name" onChange={onInputChange.bind(undefined, 'lastName')}/>
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
