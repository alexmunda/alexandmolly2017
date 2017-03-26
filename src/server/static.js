"use strict";
var Express = require('express');
var Favicon = require('serve-favicon');
var Path = require('path');
var Webpack = require('webpack');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');
var WebpackConfig = require('../../webpack.config');
var IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
var Paths = {
    assets: Path.join(__dirname, '../client/assets'),
    node_modules: Path.join(__dirname, '../../node_modules'),
    dist: Path.join(__dirname, '../client/dist'),
};
var initializeDevelopment = function (app) {
    var compiler = Webpack(WebpackConfig);
    app.use(WebpackDevMiddleware(compiler, {
        publicPath: WebpackConfig.output.publicPath,
        hot: true,
        quiet: false,
        noInfo: true,
        stats: {
            colors: true,
        },
    }));
    app.use(WebpackHotMiddleware(compiler, {
        log: console.log,
    }));
    app.use(WebpackConfig.output.publicPath, Express.static(Paths.assets));
};
var initializeProduction = function (app) {
    app.use(Favicon(Path.join(Paths.dist, './favicon.ico')));
    app.use(WebpackConfig.output.publicPath, Express.static(Paths.dist));
};
var initialize = function (app) {
    if (IS_DEVELOPMENT) {
        initializeDevelopment(app);
    }
    else {
        initializeProduction(app);
    }
};
exports.StaticAssets = {
    initialize: initialize,
};
//# sourceMappingURL=static.js.map