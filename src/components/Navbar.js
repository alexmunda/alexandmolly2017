import React from 'react';
import {IndexLink, Link} from 'react-router';
import "bootstrap";

const Navbar = () => {
  return(
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <IndexLink to="/" className="navbar-brand">Alex and Molly 2017</IndexLink>
        </div>
        <div className="collapse navbar-collapse" id="navbar-collapse">
          <ul className="nav navbar-nav navbar-left">
            <li><Link to="/rsvp">RSVP</Link></li>
            <li><Link to="/registry">Registry</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
