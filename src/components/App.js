import React, {PropTypes} from 'react';
import Navbar from './Navbar';

const App = (props) => {
  return(
    <div>
      <Navbar/>
      <h1>Alex and Molly</h1>
      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
