import { RestServer } from "../lib/rest"
import { healthCheck } from "./health-check"
import { postMessage } from "./post"
import { getMessages } from "./get"

export function setRoutes(rest: RestServer): void {
    const server = rest.getServer()

    server.get('/health-check', healthCheck)
    server.post('/message', postMessage)
    server.get('/messages', getMessages)
}