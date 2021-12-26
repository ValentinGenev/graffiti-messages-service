import dotenv from 'dotenv'
import * as _database from './lib/database'
import * as _rest from './lib/rest'

dotenv.config()

export const database = new _database.MySqlDatabase({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
})
export const rest = new _rest.RestServer({
    port: process.env.REST_PORT
})

_database.connect(database)
_database.setDatabase(database)
_rest.start(rest)