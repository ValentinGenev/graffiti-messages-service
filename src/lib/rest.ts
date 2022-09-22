interface ServerConfiguration extends Server {
    host?: string,
    port?: number
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
        this.host = configuration.host ? configuration.host : 'localhost'
        this.port = configuration.port ? configuration.port : 5000
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

    start(): void {
        const server = this.getServer()
        const host = this.getHost()
        const port = this.getPort()

        server.listen(port, () => {
            console.log(`Server listening on: ${host}:${port}`)
        })
    }
}