import React from 'react';
import RsvpForm from '../components/RsvpForm';

const RSVP_TEMPLATE = {
  attending: true,
  firstName: "",
  lastName: "",
  guests: [],
  foodChoice: ""
};

class RsvpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvp: RSVP_TEMPLATE
    };

    this.updateRsvp = this.updateRsvp.bind(this);
  }

  updateRsvp(rsvp) {
    this.setState({rsvp: rsvp});
  }

  submitRsvp() {
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
    return (
      <div>
        RSVP page
        <RsvpForm onChange={this.updateRsvp} onSubmit={this.submitRsvp} rsvp={this.state.rsvp}/>
      </div>
    );
  }
}

export default RsvpPage;
