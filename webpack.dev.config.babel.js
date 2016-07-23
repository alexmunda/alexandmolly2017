import {resolve} from 'path';
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
    module: {
      loaders: [
        {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/},
        {test: /\.css$/, loaders: ['style', 'css']},
      ],
    },
    // plugins: [
    //   new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
    //     template: '../index.html',
    //     minify: {
    //       removeComments: true,
    //       collapseWhitespace: true
    //     },
    //     inject: true
    // })
    // ]
  });
};
