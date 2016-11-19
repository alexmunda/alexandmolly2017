"use strict";
var authenticationConstants_1 = require('./constants/authenticationConstants');
var config_1 = require('./db/config');
var queries_1 = require('./db/queries');
var bodyParser = require('body-parser');
var express = require('express');
var jwt = require('jsonwebtoken');
var Pool = require('pg').Pool;
var rootPath = require('app-root-path');
var app = express();
var pool = new Pool(config_1.default);
app.set('view engine', 'jade');
app.use('/dist', express.static(rootPath.path + "/dist"));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.locals.DistPath = function (file) { return ("/dist/" + file); };
    next();
});
app.disable('x-powered-by');
app.get('/', function (req, res) {
    res.render('home', { title: 'Home Page' });
});
app.get('/rsvp', function (req, res) {
    res.render('rsvp', { title: 'RSVP Page' });
});
app.get('/about', function (req, res) {
    res.render('about', { title: 'About Page' });
});
app.post('/api/authenticate', function (req, res) {
    var userToken = req.body.userToken;
    if (!userToken) {
        return res.status(401).send({ message: 'Invalid token.' });
    }
    jwt.verify(userToken, authenticationConstants_1.jwtSecret, function (err, decoded) {
        if (err) {
            console.log("Error " + err + ".");
            return res.status(401).send({ message: 'Invalid token.' });
        }
        else if (decoded.accessCode === authenticationConstants_1.validAccessCode) {
            console.log("Decoded JWT: " + JSON.stringify(decoded));
            return res.status(200).send({ message: 'Access granted.' });
        }
        else {
            return res.status(401).send({ message: 'Unable to validate token.' });
        }
    });
});
app.post('/api/token', function (req, res) {
    var accessCode = req.body.accessCode;
    if (accessCode !== authenticationConstants_1.validAccessCode) {
        return res.status(401).send({ message: 'Invalid access code.' });
    }
    else if (accessCode === authenticationConstants_1.validAccessCode) {
        var token = jwt.sign({ accessCode: authenticationConstants_1.validAccessCode }, authenticationConstants_1.jwtSecret);
        return res.status(201).send({ token: token });
    }
});
app.post('/api/rsvp', function (req, res) {
    var rsvp = req.body.rsvp;
    var onError = function () { return res.status(400).send({ message: 'Error saving RSVP.' }); };
    if (rsvp.hasErrors === 'true' || !rsvp) {
        return onError();
    }
    return queries_1.insertDefaultGroup(pool)
        .then(function () { return queries_1.selectNewestGroupId(pool); })
        .then(function (result) { return result.rows[0].group_id; })
        .then(function (groupId) { return queries_1.insertGuestsWithGroup(pool, rsvp, groupId); })
        .then(function () { return res.status(201).send({ message: 'RSVP successful.' }); })
        .catch(function (err) {
        console.log(err);
        return onError();
    });
});
queries_1.createTables(pool)
    .then(app.listen(4444, function () { return console.log('Listening at http://localhost:4444'); }));
//# sourceMappingURL=server.js.map