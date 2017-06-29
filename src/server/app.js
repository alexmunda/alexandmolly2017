"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var static_1 = require("./static");
var db_factory_1 = require("./db/db_factory");
var _ = require("lodash");
var bodyParser = require('body-parser');
var express = require('express');
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
        res.locals.WebpackPath = function (x) { return "/assets/" + x; };
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
var firstRow = function (res) {
    if (res.rows.length > 1) {
        throw new Error('Multiple rows found, but expected only one.');
    }
    if (res.rows.length === 0) {
        return null;
    }
    return res.rows[0];
};
app.get('/api/guests', function (req, res) {
    var _a = req.query, first_name = _a.first_name, last_name = _a.last_name;
    if (_.isNil(first_name) || _.isNil(last_name)) {
        throw new Error('First and last name required.');
    }
    return db_factory_1.DbFactory.create()
        .sql('fetch_guest', {
        first_name: first_name,
        last_name: last_name,
    })
        .then(function (db_res) { return firstRow(db_res); })
        .then(function (fetch_result) {
        if (_.isNil(fetch_result)) {
            return res.status(404).json({ message: 'Unable to find guest.' });
        }
        return res.status(200).json(fetch_result);
    })
        .catch(function (err) {
        return res.status(400).json({ message: err.message });
    });
});
app.listen(process.env.PORT || 4444, function () { return console.log("Listening at http://localhost:" + (process.env.PORT || 4444)); });
//# sourceMappingURL=app.js.map