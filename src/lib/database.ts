export class MySqlDatabase {
    private connection

    constructor(connection: any) {
        this.connection = connection
    }

    getConnection() {
        return this.connection
    }

    connect() {
        this.connection.connect((error: any) => { if (error) throw error })
    }

    end() {
        this.connection.end((error: any) => { if (error) throw error })
    }

    query(queryString: string, parameters: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, parameters,
                    (error: { message: any }, result: any) => {

                // TODO: error handling for the SQL
                if (error) reject(error.message)

                resolve(result)
            })
        })
    }
}
