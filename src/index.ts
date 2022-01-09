import dotenv from 'dotenv'
import * as _database from './lib/database'
import * as _rest from './lib/rest'
import * as _router from './controllers/routes'

dotenv.config()

export const database = new _database.MySqlDatabase({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
})
export const rest = new _rest.RestServer({
    port: process.env.REST_PORT
})

_database.connect(database)
_database.createEntriesTable(database)
_rest.start(rest)
_router.setRoutes(rest)