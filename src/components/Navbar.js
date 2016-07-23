import React from 'react';
import {IndexLink, Link} from 'react-router';

const Navbar = () => {
  return(
    <div>
      <ul>
        <li><IndexLink to="/">Home</IndexLink></li>
        <li><Link to="/rsvp">RSVP</Link></li>
        <li><Link to="/registry">Registry</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
