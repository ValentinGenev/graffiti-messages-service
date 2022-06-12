import dotenv from 'dotenv'
import * as libDatabase from './lib/database'
import * as libRest from './lib/rest'
import * as dalCreate from './dal/create'
import * as dalSettings from './dal/settings'
import * as router from './controllers/routes'

dotenv.config()

export const database = new libDatabase.MySqlDatabase({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
})
export const rest = new libRest.RestServer({
    port: process.env.REST_PORT
})

libDatabase.connect(database)
dalCreate.createTables(database)
dalSettings.syncZoneWithNode(database)

if (process.env.NODE_ENV !== 'test') {
    libRest.useBodyParser(rest)
    libRest.start(rest)
    router.setRoutes(rest)
}

// TODO: make sure that the server doesn't hang if an error is thrown