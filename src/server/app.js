"use strict";
var authenticationConstants_1 = require('./constants/authenticationConstants');
var static_1 = require('./static');
var bodyParser = require('body-parser');
var express = require('express');
var jwt = require('jsonwebtoken');
var Path = require('path');
var Fs = require('fs');
var app = express();
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'jade');
static_1.StaticAssets.initialize(app);
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'production') {
    var webpack_manifest_path = Path.join(__dirname, '../client/dist/manifest.json');
    var webpack_manifest_1 = JSON.parse(Fs.readFileSync(webpack_manifest_path));
    var getWebpackPath_1 = function (key) {
        return "/assets/" + (webpack_manifest_1[key] || key);
    };
    app.use(function (req, res, next) {
        res.locals.WebpackPath = getWebpackPath_1;
        next();
    });
    app.use(function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    });
}
else {
    app.use(function (req, res, next) {
        res.locals.WebpackPath = function (x) { return ("/assets/" + x); };
        next();
    });
}
app.disable('x-powered-by');
app.get('/', function (req, res) {
    res.render('home', { title: 'Molly & Alex' });
});
app.get('/rsvp', function (req, res) {
    res.render('rsvp', { title: 'RSVP' });
});
app.get('/registry', function (req, res) {
    res.render('registry', { title: 'Registry' });
});
app.get('/about', function (req, res) {
    res.render('about', { title: 'About' });
});
app.get('/photos', function (req, res) {
    res.render('photos', { title: 'Photos' });
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
app.listen(process.env.PORT || 4444, function () { return console.log("Listening at http://localhost:" + (process.env.PORT || 4444)); });
//# sourceMappingURL=app.js.map