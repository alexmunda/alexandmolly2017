import { jwtSecret, validAccessCode } from './constants/authenticationConstants'
// import dbConfig from './db/config'
// import { createTables, insertDefaultGroup, insertGuestsWithGroup, selectNewestGroupId } from './db/queries'
import { StaticAssets } from './static'

const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const Path = require('path')
const Fs = require('fs')
// const Pool = require('pg').Pool

const app = express()

// const pool = new Pool(dbConfig)

app.set('views', Path.join(__dirname, 'views'))
app.set('view engine', 'jade')

StaticAssets.initialize(app)

app.use(bodyParser.json())

// Setup config/index.ts eventually and read from there
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

app.post('/api/authenticate', (req, res) => {
  const { userToken } = req.body

  if (!userToken) {
    return res.status(401).send({ message: 'Invalid token.' })
  }

  jwt.verify(userToken, jwtSecret, (err, decoded) => {
    if (err) {
      console.log(`Error ${err}.`)
      return res.status(401).send({ message: 'Invalid token.' })
    }

    else if (decoded.accessCode === validAccessCode) {
      console.log(`Decoded JWT: ${JSON.stringify(decoded)}`)
      return res.status(200).send({ message: 'Access granted.' })
    }

    else {
      return res.status(401).send({ message: 'Unable to validate token.' })
    }
  })

})

app.post('/api/token', (req, res) => {
  const { accessCode } = req.body

  if (accessCode !== validAccessCode) {
    return res.status(401).send({ message: 'Invalid access code.' })
  }

  else if (accessCode === validAccessCode) {
    const token = jwt.sign({ accessCode: validAccessCode }, jwtSecret)
    return res.status(201).send({ token: token })
  }
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
    app.listen(4444,
    () => console.log('Listening at http://localhost:4444'))
// )
