process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const DEVELOPMENT = process.env.NODE_ENV !== 'production'
const PRODUCTION = !DEVELOPMENT

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const Path = require('path')
const Webpack = require('webpack')
const _ = require('lodash')

const OutputPath = Path.resolve(__dirname, 'src/client/dist')

function IfDevelopment(thing, other) {
   return DEVELOPMENT
      ? thing
      : other
}

function OnlyIn(test, thing) {
   if (test)
      return thing
}

module.exports = {
   entry: [
      OnlyIn(DEVELOPMENT, 'webpack-hot-middleware/client'),
      './main.js'
   ],
   output: {
      filename: 'main.js',
      path: OutputPath,
      publicPath: '/dist/',
      pathinfo: true,
      library: [
         'alexandmolly', 'main'
      ],
      libraryTarget: 'var'
   },
   context: Path.resolve(__dirname, 'src/client'),
   devtool: IfDevelopment('eval', 'source-map'),
   module: {
      loaders: [
         {
            test: /\.elm$/,
            exclude: [
               /elm-stuff/, /node_modules/
            ],
            loaders: _.compact([
               OnlyIn(DEVELOPMENT, 'elm-hot'),
               'elm-webpack-loader'
            ])
         }, {
            test: /\.css$/,
            loaders: ['style', 'css']
         }, {
            test: /(\.scss)$/,
            loader: ExtractTextPlugin.extract(['css','sass'])
         }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
         }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
         }
      ]
   },
   resolve: {
      extensions: ['.js', '.elm', '.scss']
   },
   plugins: _.compact([
      OnlyIn(DEVELOPMENT, new Webpack.HotModuleReplacementPlugin()),
      new Webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery'}),
      new ExtractTextPlugin('main.css')
   ])
}
