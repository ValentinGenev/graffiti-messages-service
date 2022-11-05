interface ServerConfiguration extends Server {
    host: string,
    port: number
}
interface Server {
    server: {
        use: (callback: any) => {},
        listen: (port: number, callback: any) => {},
        get: (path: string, callback: any) => {},
        post: (path: string, callback: any) => {}
    }
}

export class RestServer {
    private server
    private host: string
    private port: number

    constructor(configuration: ServerConfiguration) {
        this.server = configuration.server
        this.host = configuration.host
        this.port = configuration.port
    }

    getServer() {
        return this.server
    }
    getPort() {
        return this.port
    }
    getHost() {
        return this.host
    }

    start(callback: any) {
        const server = this.getServer()
        const port = this.getPort()

        server.listen(port, callback)
    }
}