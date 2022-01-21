import { RestServer } from '../lib/rest'
import { documentation } from './documentation'
import { healthCheck } from './health-check'
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