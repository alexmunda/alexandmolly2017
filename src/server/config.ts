interface Config {
  DATABASE_URL: string
  DB_ROOT_DIR: string
  RSVP_BASIC_AUTH_PASSWORD: string
}

if (process.env.NODE_ENV === 'development') {
  process.env.DATABASE_URL = 'postgres://alex@localhost:5433/alexandmolly2017?sslmode=disable'
  process.env.RSVP_BASIC_AUTH_PASSWORD = 'test'
}

const config: Config = {
  ...process.env,
  DB_ROOT_DIR: `${__dirname}/db/sql`
}

export default config
