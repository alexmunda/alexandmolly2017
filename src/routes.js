import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage';
import RsvpPage from './containers/RsvpPage';
import RegistryPage from './components/RegistryPage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import AccommodationsPage from './components/AccommodationsPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="rsvp" component={RsvpPage}/>
    <Route path="accommodations" component={AccommodationsPage}/>
    <Route path="registry" component={RegistryPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
