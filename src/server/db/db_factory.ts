import * as Tiny from 'tinypg'
import Config from '../config'

export const DbFactory = {
  create: () => new Tiny.TinyPg({
    root_dir: [ Config.DB_ROOT_DIR ],
    connection_string: Config.DATABASE_URL,
  })
}
