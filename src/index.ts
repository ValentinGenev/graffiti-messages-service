import express from 'express'
import dotenv from 'dotenv'
import * as database from './lib/database'

dotenv.config()

const dbConnection = database.connect({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
})
database.setDatabase(dbConnection)

const server = express()

server.get('/', (_request, response) => {
    response.send('Hello world!')
})

server.listen(5000, () => console.log('Server listening on: localhost:5000'))