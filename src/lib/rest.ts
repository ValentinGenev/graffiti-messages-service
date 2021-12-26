import express from 'express'

interface ServerConfiguration {
    port?: string
}

export class RestServer {
    private server: express.Express
    private port: string | undefined

    constructor(configuration: ServerConfiguration) {
        this.port = configuration.port
        this.server = express()
    }

    public getServer(): express.Express {
        return this.server
    }
    public getPort(): string | undefined {
        return this.port
    }
}

export function start(rest: RestServer) {
    const server = rest.getServer()
    const port = rest.getPort() ? rest.getPort() : '5000'

    server.listen(port, () => {
        console.log(`Server listening on: localhost:${port}`)
    })
}