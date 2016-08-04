import React from 'react';
import {IndexLink, Link} from 'react-router';

class Navbar extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <IndexLink to="/" className="brand-logo">Alex and Molly 2017</IndexLink>
          <a href="#" data-activates="left-mobile-nav" className="button-collapse">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            <li>
              <Link to="/rsvp">RSVP</Link>
            </li>
            <li>
              <Link to="/registry">Registry</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
          <ul className="side-nav" id="left-mobile-nav">
            <li>
              <Link to="/rsvp">RSVP</Link>
            </li>
            <li>
              <Link to="/registry">Registry</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
