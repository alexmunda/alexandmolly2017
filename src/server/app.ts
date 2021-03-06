import { StaticAssets } from './static'
import { DbFactory } from './db/db_factory'
import * as M from './models'
import * as _ from 'lodash'
import Config from './config'

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
  res.render('home', { title: 'Alex and Molly - October 28th, 2017' })
})

app.get('/rsvp', (req, res) => {
  res.render('rsvp', { title: 'Alex and Molly - RSVP' })
})

app.get('/registry', (req, res) => {
  res.render('registry', { title: 'Alex and Molly - Registry' })
})

app.get('/about', (req, res) => {
  res.render('about', { title: 'Alex and Molly - About' })
})

app.get('/photos', (req, res) => {
  res.render('photos', { title: 'Alex and Molly - Photos' })
})

app.get('/accommodations', (req, res) => {
  res.render('accommodations', { title: 'Alex and Molly - accommodations' })
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
  return Promise.resolve()
  .then(() => {
    const { first_name, last_name } = req.query

    if (_.isNil(first_name) || _.isNil(last_name)) {
      throw new Error('First and last name required.')
    }

    return DbFactory.create()
    .sql('fetch_guest', {
      first_name: first_name,
      last_name: last_name,
    })
  })
  .then(db_res => firstRow(db_res))
  .then((fetch_result: M.GuestFetch) => {
    if (_.isNil(fetch_result)) {
      throw new Error('Unable to find guest.')
    }

    return res.status(200).json(fetch_result)
  })
  .catch(err => {
    console.log({
      err: err,
      request_body: req.body
    })
    return res.status(404).json({ message: 'Unable to find guest.' })
  })
})

const validateRsvp = (rsvp: M.Rsvp) => {
  if (_.isNil(rsvp.guest_id) || !_.isFinite(rsvp.guest_id)) {
    throw {
      status: 400,
      message: 'guest_id is required',
    }
  }

  if (_.isNil(rsvp.party_id) || !_.isFinite(rsvp.party_id)) {
    throw {
      status: 400,
      message: 'party_id is required',
    }
  }

  if (_.isNil(rsvp.attending) || !_.isBoolean(rsvp.attending)) {
    throw {
      status: 400,
      message: 'attending is required',
    }
  }

  if (_.isNil(rsvp.party_size) || !_.isFinite(rsvp.party_size)) {
    throw {
      status: 400,
      message: 'party_size is required',
    }
  }
}

app.post('/api/rsvp', (req, res) => {
  return Promise.resolve()
  .then(() => {
    const rsvp: M.Rsvp = req.body

    validateRsvp(rsvp)

    return DbFactory.create()
    .transaction((transaction_db) => {
      return transaction_db.sql('save_rsvp', {
        guest_id: rsvp.guest_id,
        party_id: rsvp.party_id,
        party_size: rsvp.party_size,
        attending: rsvp.attending,
        comment: rsvp.comment,
      })
    })
  })
  .then(db_res => firstRow(db_res))
  .then((rsvp_res: M.GuestFetch) => {
    if (_.isNil(rsvp_res.guest) || _.isNil(rsvp_res.party)) {
      throw {
        status: 400,
        message: 'Unable to save rsvp.',
      }
    }

    return res.status(201).json(rsvp_res)
  })
  .catch(err => {
    console.log({
      err: err,
      body: req.body
    })
    return res.status(400).json({ error: 'Unable to save rsvp.' })
  })
})

const rsvpsBasicAuth = (req, res) => {
  const base_64_auth_header = _.get(req.headers, 'authorization', '').split(' ')[1] || ''
  const [username, password] = new Buffer(base_64_auth_header, 'base64').toString().split(':')

  if (username === 'molly' && password === Config.RSVP_BASIC_AUTH_PASSWORD) {
    return DbFactory.create().sql('retrieve_rsvps')
    .then(db_res => firstRow(db_res))
    .then(rsvps => {
      const ordered_rsvped_parties = _.sortBy(rsvps.rsvped_parties, (rsvped_party: any) => new Date(rsvped_party.rsvp_on))
      const rsvp_res = {
        ...rsvps,
        rsvped_parties: ordered_rsvped_parties,
      }
      return res.render('view_rsvps', { title: 'Alex and Molly - RSVP', rsvp_res: rsvp_res })
    })
  }

  res.set('WWW-Authenticate', 'Basic')
  return res.status(401).json({ error: { message: 'Unauthorized' } })
}

app.get('/view_rsvps', rsvpsBasicAuth)

app.use((err, req, res, next) => {
  res.status(err.status || 500)

  console.log(`Error [statusCode=${err.status}] in request pipeline`, {
    message: err.message,
    status: err.status,
    err: err,
  })

  return res.json({
    error: err.message
  })
})

app.listen(process.env.PORT || 4444, () => console.log(`Listening at http://localhost:${process.env.PORT || 4444}`))
