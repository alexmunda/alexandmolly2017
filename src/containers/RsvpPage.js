import classNames from 'classnames';
import React from 'react';
import RsvpForm from '../components/RsvpForm';
import {RSVP_TEMPLATE} from '../constants/formConstants';

class RsvpPage extends React.Component {
  state = {
    rsvp: RSVP_TEMPLATE
  };

  updateRsvp = (rsvp) => {
    this.setState({rsvp: rsvp});
  }

  submitRsvp = () => {
    const validatedRsvp = this.validateRsvp(this.state.rsvp);
    console.log('Submit: ', validatedRsvp);
    if (validatedRsvp.hasErrors === 'true'){
      return this.setState({rsvp: validatedRsvp});
    }
    // fetch('/api/rsvp', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state.rsvp)
    // })
    // .then((response) => {
    //   if(response.status == 201){
    //     this.setState({rsvp: RSVP_TEMPLATE});
    //   }
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }

  validateRsvp = (rsvp) => {
    const getErrorsForGuest = (guest) => {
      return Object.keys(guest).map(key => {
        if (!guest[key]) {
          return {[key]: 'Required'};
        }
        return {};
      }).reduce((previousError, error) => ({
        ...previousError,
        ...error
      }), {});
    };

    const validatedGuests = rsvp.guests.map(guest => {
      const errors = getErrorsForGuest(guest);
      return {
        ...guest,
        errors: errors
      };
    });

    const hasErrors = validatedGuests.filter(guest => Object.keys(guest.errors) > 0).length > 0 ?
        'true' :
        'false';

    return {
      ...rsvp,
      hasErrors,
      guests: validatedGuests
    };
  }

  render() {
    const containerClassname = classNames('container');

    return (
      <div className={containerClassname}>
        <RsvpForm onChange={this.updateRsvp} onSubmit={this.submitRsvp} rsvp={this.state.rsvp} validateRsvp={this.validateRsvp}/>
      </div>
    );
  }
}

export default RsvpPage;
