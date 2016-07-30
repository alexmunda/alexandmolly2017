import React, {Component} from 'react';
import Countdown from 'react-count-down';

class HomePage extends Component {
  render(){
    let options = {endDate: '10/21/2017 3:00 PM', prefix: 'until the wedding!'};
    return(
      <div className="container">
        <h3>Home page</h3>
        <Countdown options={options} />
      </div>
    );
  }

}

export default HomePage;
