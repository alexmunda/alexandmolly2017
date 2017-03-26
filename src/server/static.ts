const Express = require('express')
const Favicon = require('serve-favicon')
const Path = require('path')
const Webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')
const WebpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('../../webpack.config')

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'

const Paths = {
   assets: Path.join(__dirname, '../client/assets'),
   node_modules: Path.join(__dirname, '../../node_modules'),
   dist: Path.join(__dirname, '../client/dist'),
}

const initializeDevelopment = (app) => {
   const compiler = Webpack(WebpackConfig)

   app.use(WebpackDevMiddleware(compiler, {
      publicPath: WebpackConfig.output.publicPath,
      hot: true,
      quiet: false,
      noInfo: true,
      stats: {
         colors: true,
      },
   }))

   app.use(WebpackHotMiddleware(compiler, {
      log: console.log,
   }))

   app.use(WebpackConfig.output.publicPath, Express.static(Paths.assets))
}

const initializeProduction = (app) => {
   app.use(Favicon(Path.join(Paths.dist, './favicon.ico')))
   app.use(WebpackConfig.output.publicPath, Express.static(Paths.dist))
}

const initialize = (app) => {
   if (IS_DEVELOPMENT) {
      console.log('DEV')
      initializeDevelopment(app)
   } else {
     console.log('PROD')
      initializeProduction(app)
   }
}

export const StaticAssets = {
   initialize: initialize,
}
