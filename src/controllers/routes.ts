import path from 'path'
import { RestServer } from '../lib/rest'
import { postMessage } from './post'
import { getMessages, getMessage } from './get'

export function setRoutes(rest: RestServer): void {
    const server = rest.getServer()

    server.get('/', documentation)
    server.get('/health-check', healthCheck)
    server.post('/message', postMessage)
    server.get('/messages', getMessages)
    server.get('/messages/:pageIndex', getMessages)
    server.get('/last-message/:posterId', getMessage)
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