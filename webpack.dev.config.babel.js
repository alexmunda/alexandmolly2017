import {resolve} from 'path';
import webpack from 'webpack';
import webpackValidator from 'webpack-validator';
//import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = () => {
  return webpackValidator({
    debug: true,
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      pathinfo: true,
    },
    context: resolve(__dirname, 'src'),
    devtool: 'eval',
    devServer: {
      historyApiFallback: true,
      contentBase: './',
      // hot: true
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        loaders: ['style', 'css']
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }],
    },
    plugins: [
      new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
      //   // new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
      //     template: '../index.html',
      //     minify: {
      //       removeComments: true,
      //       collapseWhitespace: true
      //     },
      //     inject: true
      // })
    ]
  });
};
