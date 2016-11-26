process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const DEVELOPMENT = process.env.NODE_ENV !== 'production'
const PRODUCTION = !DEVELOPMENT

const Path = require('path')
const webpack = require('webpack')

const OutputPath = Path.resolve(__dirname, 'src/client/dist')

function IfDevelopment(thing, other) {
   return DEVELOPMENT ? thing : other
}

module.exports = {
  entry: [
    './main.js'
  ],
  output: {
    filename: 'main.js',
    path: OutputPath,
    publicPath: '/dist/',
    pathinfo: true,
    library: ['alexandmolly', 'main'],
    libraryTarget: 'var',
  },
  context: Path.resolve(__dirname, 'src/client'),
  devtool: IfDevelopment('eval', 'source-map'),
  module: {
    loaders: [{
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
    new webpack.ProvidePlugin({
       $: 'jquery',
       jQuery: 'jquery',
       'window.jQuery': 'jquery',
    })
  ]
}
