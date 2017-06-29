import { StaticAssets } from './static'
import { DbFactory } from './db/db_factory'
import * as M from './models'
import * as _ from 'lodash'

const bodyParser = require('body-parser')
const express = require('express')
const Path = require('path')
const Fs = require('fs')

const app = express()

app.set('views', Path.join(__dirname, 'views'))
app.set('view engine', 'jade')

StaticAssets.initialize(app)

app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production') {
   const webpack_manifest_path = Path.join(__dirname, '../client/dist/manifest.json')

   const webpack_manifest = JSON.parse(Fs.readFileSync(webpack_manifest_path))

   const getWebpackPath = (key) => {
      return `/assets/${webpack_manifest[key] || key}`
   }

   app.use((req, res, next) => {
      res.locals.WebpackPath = getWebpackPath
      next()
   })

   app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''))
      }
      next()
   })
} else {
   app.use((req, res, next) => {
      res.locals.WebpackPath = x => `/assets/${x}`
      next()
   })
}

app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.render('home', { title: 'Molly & Alex' })
})

app.get('/rsvp', (req, res) => {
  res.render('rsvp', { title: 'RSVP' })
})

app.get('/registry', (req, res) => {
  res.render('registry', { title: 'Registry' })
})

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' })
})

app.get('/photos', (req, res) => {
  res.render('photos', { title: 'Photos' })
})

const firstRow = (res) => {
  if (res.rows.length > 1) {
    throw new Error('Multiple rows found, but expected only one.')
  }

  if (res.rows.length === 0) {
    return null
  }

  return res.rows[0]
}

app.get('/api/guests', (req, res) => {
  const { first_name, last_name } = req.query

  if (_.isNil(first_name) || _.isNil(last_name)) {
    throw new Error('First and last name required.')
  }

  return DbFactory.create()
  .sql('fetch_guest', {
    first_name: first_name,
    last_name: last_name,
  })
  .then(db_res => firstRow(db_res))
  .then((fetch_result: M.GuestFetch) => {
    if (_.isNil(fetch_result)) {
      return res.status(404).json({ message: 'Unable to find guest.' })
    }

    return res.status(200).json(fetch_result)
  })
  .catch(err => {
    return res.status(400).json({ message: err.message })
  })
})

// app.post('/api/rsvp', (req, res) => {
//   const { rsvp } = req.body
//   const onError = () => res.status(400).send({ message: 'Error saving RSVP.' })
//
//   if (rsvp.hasErrors === 'true' || !rsvp) {
//     return onError()
//   }
//
//   return insertDefaultGroup(pool)
//     .then(() => selectNewestGroupId(pool))
//     .then((result) => result.rows[0].group_id)
//     .then((groupId) => insertGuestsWithGroup(pool, rsvp, groupId))
//     .then(() => res.status(201).send({ message: 'RSVP successful.' }))
//     .catch((err) => {
//       console.log(err)
//       return onError()
//     })
// })

// createTables(pool)
//   .then(
    app.listen(process.env.PORT || 4444,
      () => console.log(`Listening at http://localhost:${process.env.PORT || 4444}`))
// )
