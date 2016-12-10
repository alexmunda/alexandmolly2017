process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const DEVELOPMENT = process.env.NODE_ENV !== 'production'
const PRODUCTION = !DEVELOPMENT

const Path = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const _ = require('lodash')

function IfDevelopment(thing, other) {
   return DEVELOPMENT
      ? thing
      : other
}

function OnlyIn(test, thing) {
   if (test)
      return thing
}

const AssetsPath = Path.join(__dirname, '/src/client/assets')
const OutputPath = Path.join(__dirname, '/src/client/dist')
const ElmStuffPath = Path.join(__dirname, '/elm-stuff')
const ScriptsPath = Path.join(__dirname, '/src/client/scripts')
const ServePath = '/assets/'

module.exports = {
   entry: [
      OnlyIn(DEVELOPMENT, 'webpack-hot-middleware/client'),
      `${ScriptsPath}/main.js`
   ],
   output: {
      filename: '[name].js',
      path: OutputPath,
      publicPath: ServePath,
      pathinfo: true,
      library: [
         'alexandmolly', '[name]'
      ],
      libraryTarget: 'var'
   },
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
      new ExtractTextPlugin('main.css'),
      OnlyIn(PRODUCTION, new CleanWebpackPlugin([OutputPath, ElmStuffPath])),
      new CopyWebpackPlugin([{
         from: AssetsPath,
         to: OutputPath,
      }])
   ])
}
