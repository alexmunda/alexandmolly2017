import { resolve } from 'path'
import webpackValidator from 'webpack-validator'
import Webpack from 'webpack'

module.exports = (env) => {
  return webpackValidator({
    entry: [
      './main.js'
    ],
    output: {
      filename: 'main.js',
      path: resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      pathinfo: true,
      library: ['alexandmolly', 'main'],
      libraryTarget: 'var',
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
      extensions: ['.js', '.elm']
    },
    plugins: [
      new Webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery',
         'window.jQuery': 'jquery',
      })
    ]
  })
}
