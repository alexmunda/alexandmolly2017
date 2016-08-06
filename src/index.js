import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import 'materialize-css';
require('../node_modules/material-design-icons/iconfont/material-icons.css');
require('../node_modules/materialize-css/bin/materialize.css');
require('./styles/styles.css');

render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById("app")
);
