import React from 'react';
import RsvpForm from '../components/RsvpForm';
import classNames from 'classnames';

const RSVP_TEMPLATE = {
  attending: 'true',
  firstName: '',
  lastName: '',
  guests: [],
  foodChoice: ''
};

class RsvpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvp: RSVP_TEMPLATE
    };

    this.updateRsvp = this.updateRsvp.bind(this);
    this.submitRsvp = this.submitRsvp.bind(this);
  }

  updateRsvp(rsvp) {
    this.setState({rsvp: rsvp});
  }

  submitRsvp() {
    console.log('Submit: ', this.state.rsvp);
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

  render() {
    const containerClassname = classNames('container');

    return (
      <div className={containerClassname}>
        <RsvpForm onChange={this.updateRsvp} onSubmit={this.submitRsvp} rsvp={this.state.rsvp}/>
      </div>
    );
  }
}

export default RsvpPage;
