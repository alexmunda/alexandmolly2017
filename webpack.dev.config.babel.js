import {
  resolve
} from 'path';
import webpackValidator from 'webpack-validator';

module.exports = (env) => {
  return webpackValidator({
    debug: true,
    entry: [
      './index.js'
    ],
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      pathinfo: true,
    },
    context: resolve(__dirname, 'src'),
    devtool: env.dev ? 'eval' : 'source-map',
    module: {
      loaders: [{
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      }, {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loaders: ['elm-webpack-loader']
      }, {
        test: /\.css$/,
        loaders: ['style', 'css']
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }],
    },
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.elm']
    }
  });
};
