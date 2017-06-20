const Path = require('path')

interface Config {
  DATABASE_URL: string
  DB_ROOT_DIR: string
}

const config: Config = {
  ...process.env,
  DB_ROOT_DIR: Path.join(__dirname, './db/sql')
}

if (process.env.NODE_ENV === 'development') {
  process.env.DATABASE_URL = 'postgres://localhost:5433/alexandmolly2017'
}

export default config
