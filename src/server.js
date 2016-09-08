import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import routes from './routes';
import rootPath from 'app-root-path';

const app = express();

app.set('view engine', 'ejs');

app.use('/dist', express.static(`${rootPath.path}/dist`));

app.get('*', (req, res) => {
      match({
          routes,
          location: req.url
        }, (error, redirectLocation, renderProps) => {
          if (error) {
            res.status(500).send(error.message);
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
            res.status(404).send('Not found');
          }
      });
  });

  app.listen(8080, function() {
      console.log('Listening at http://localhost:8080');
    });
