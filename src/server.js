import bodyParser from 'body-parser';
import {jwtSecret, validAccessCode} from './constants/authenticationConstants';
import dbConfig from './db/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import {Pool} from 'pg';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import routes from './routes';
import rootPath from 'app-root-path';

const app = express();

const pool = new Pool(dbConfig);

app.set('view engine', 'ejs');

app.use('/dist', express.static(`${rootPath.path}/dist`));
app.use(bodyParser.json());

app.disable('x-powered-by');

app.get('*', (req, res) => {
  match({
      routes,
      location: req.url
    }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send({message: error.message});
      }

      else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      else if (renderProps) {
        const html = renderToString(<RouterContext {...renderProps}/>);
          res.render('index', {
            html: html
          });
        }
      else {
        res.status(404).send({message: 'Not found'});
      }
  });
});

app.post('/api/authenticate', (req, res) => {
  const {userToken} = req.body;

  if(!userToken) {
    return res.status(401).send({message: 'Invalid token.'});
  }

  jwt.verify(userToken, jwtSecret, (err, decoded) => {
    if (err){
      console.log(`Error ${err}.`);
      return res.status(401).send({message: 'Invalid token.'});
    }

    else if(decoded.accessCode === validAccessCode) {
      console.log(`Decoded JWT: ${JSON.stringify(decoded)}`);
      return res.status(200).send({message: 'Access granted.'});
    }

    else {
      return res.status(401).send({message: 'Unable to validate token.'});
    }
  });

});

app.post('/api/token', (req, res) => {
  const {accessCode} = req.body;

  if(accessCode !== validAccessCode) {
    return res.status(401).send({message: 'Invalid access code.'});
  }

  else if(accessCode === validAccessCode){
    const token = jwt.sign({accessCode: validAccessCode}, jwtSecret);
    return res.status(201).send({token: token});
  }
});

app.post('/api/rsvp', (req, res) => {
  const {rsvp} = req.body;
  const onError = () => res.status(400).send({message: 'Error saving RSVP.'});
  const getValues = (guest, groupId, attending) => `VALUES ('${guest.firstName}', '${guest.lastName}', ${attending}, CURRENT_TIMESTAMP, ${groupId})`;
  const insertGuestsWithGroup = (rsvp, groupId) => {
    const attending = {rsvp};
    const guestValues = rsvp.guests.map((guest) => getValues(guest, groupId, attending)).join(' ');
    return pool.query(`INSERT INTO guests (first_name, last_name, attending, date_created, group_id) VALUES ${guestValues}`);
  };

  if(rsvp.hasErrors === 'true' || !rsvp){
    return onError();
  }

  pool
    .query('INSERT INTO groups DEFAULT VALUES')
    .then(() => pool.query('SELECT group_id FROM GROUPS ORDER BY date_created DESC LIMIT 1'))
    .then((result) => Promise.resolve(result.rows[0]))
    .then((groupId) => insertGuestsWithGroup(rsvp, groupId))
    .catch((err) => {
      console.log(err);
      return onError();
    });

  console.log(JSON.stringify(rsvp));

  return res.status(201).send({message: 'RSVP successful.'});
});

app.listen(8080, function() {
  console.log('Listening at http://localhost:8080');
});
