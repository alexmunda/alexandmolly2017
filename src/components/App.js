import React, {PropTypes} from 'react';
import Navbar from './Navbar';

const App = (props) => {
  return(
    <div>
      <Navbar/>
      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
