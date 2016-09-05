import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import routes from './src/routes';

const app = express();

app.set('view engine', 'ejs');

app.use('/dist', express.static(`${__dirname}/dist`));

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

    const server = app.listen(8080, function() {
      const host = server.address().address;
      const port = server.address().port;
      console.log(`Example app listening at http://${host}:${port}`);
    });
