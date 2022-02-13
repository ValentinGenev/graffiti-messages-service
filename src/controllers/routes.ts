import dotenv from 'dotenv'
import path from 'path'
import { RestServer } from '../lib/rest'
import { postMessage } from './post'
import { getMessages, getMessage } from './get'

dotenv.config()

const REST_PATH = process.env.REST_PATH

export function setRoutes(rest: RestServer): void {
    const server = rest.getServer()

    server.get(`${REST_PATH}/`, documentation)
    server.get(`${REST_PATH}/health-check`, healthCheck)
    server.get(`${REST_PATH}/all`, getMessages)
    server.get(`${REST_PATH}/all/:pageIndex`, getMessages)
    server.get(`${REST_PATH}/last/:posterId`, getMessage)
    
    server.post(`${REST_PATH}/new`, postMessage)
}

export function healthCheck(_request: Record<string, any>, response: Record<string, any>): void {
    response.json({ status: 'online' })
}

export function documentation(_request: Record<string, any>, response: Record<string, any>): void {
    try {
        response.sendFile(path.join(__dirname, '../../public/documentation.html'))
    }
    catch (error) {
        // TODO: set different response codes
        // TODO: figure a way to log errors
        console.error(error)
        response.json({ success: false })
    } 
}