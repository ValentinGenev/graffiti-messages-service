import dotenv from 'dotenv'
import mysql from 'mysql'
import express from 'express'
import { useBodyParser } from './utilities/helper-functions'
import { MySqlDatabase } from './lib/database'
import { RestServer } from './lib/rest'
import * as dalCreate from './dal/schema'
import * as dalSettings from './dal/settings'
import * as router from './routes'
import { Logger } from './lib/logger'

Logger.info('Messages service: starting')

dotenv.config()
const { REST_HOST, REST_PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,
    NODE_ENV } = process.env

export const database = new MySqlDatabase(mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 5000,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
}), mysql)
export const rest = new RestServer({
    server: express(),
    host: REST_HOST ? REST_HOST : 'localhost',
    port: Number(REST_PORT)
})

database.connect()
dalCreate.createTables(database)
dalSettings.syncZoneWithNode(database)

if (NODE_ENV !== 'test') {
    useBodyParser(rest)
    rest.start(() =>
        Logger.info(`REST server: started; port: ${rest.getPort()}`))
    router.setRoutes(rest)
}
