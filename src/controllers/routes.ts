import dotenv from 'dotenv'
import path from 'path'
import { Request, Response } from "express"
import { RestServer } from '../lib/rest'
import { postMessage } from './post'
import { getMessages, getMessage } from './get'
import { handleFailResponse } from '../utilities/responses'

dotenv.config()

const REST_PATH = process.env.REST_PATH

export function setRoutes(rest: RestServer) {
    const server = rest.getServer()

    server.get(`${REST_PATH}/`, documentation)
    server.get(`${REST_PATH}/health-check`, healthCheck)
    server.get(`${REST_PATH}/messages`, getMessages)
    server.get(`${REST_PATH}/messages/:pageIndex`, getMessages)
    server.get(`${REST_PATH}/messages/:posterId/last`, getMessage)

    server.post(`${REST_PATH}/messages`, postMessage)
}

export function healthCheck(_request: Request, response: Response) {
    response.json({ status: 'online' })
}

export function documentation(_request: Request, response: Response) {
    try {
        response.sendFile(path.join(__dirname, '../../public/documentation.html'))
    }
    catch (error) {
        handleFailResponse(error, response)
    }
}