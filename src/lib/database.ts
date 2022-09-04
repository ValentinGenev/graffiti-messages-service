export class MySqlDatabase {
    private connection
    private utils

    constructor(connection: any, utils: any) {
        this.connection = connection
        this.utils = utils
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

    escape(input: string): string {
        return this.utils.escape(input)
    }
}
