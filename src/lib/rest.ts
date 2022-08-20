interface ServerConfiguration {
    server: any,
    host: string | undefined,
    port: number | undefined
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