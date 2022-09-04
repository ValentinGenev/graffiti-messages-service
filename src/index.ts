import dotenv from 'dotenv'
import mysql from 'mysql'
import express from 'express'

import { useBodyParser } from './utilities/helper-functions'
import { MySqlDatabase } from './lib/database'
import { RestServer } from './lib/rest'
import * as dalCreate from './dal/schema'
import * as dalSettings from './dal/settings'
import * as router from './routes'

dotenv.config()
const { env } = process

export const database = new MySqlDatabase(mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    multipleStatements: true
}), mysql)
export const rest = new RestServer({
    server: express(),
    host: env.REST_HOST,
    port: Number(env.REST_PORT)
})

database.connect()
dalCreate.createTables(database)
dalSettings.syncZoneWithNode(database)

if (env.NODE_ENV !== 'test') {
    useBodyParser(rest)
    rest.start()
    router.setRoutes(rest)
}

// TODO: make sure that the server doesn't hang if an error is thrown