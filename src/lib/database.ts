import mysql from 'mysql'

export class MySqlDatabase {
    private connection: mysql.Connection

    constructor(configuration: mysql.ConnectionConfig) {
        this.connection = mysql.createConnection(configuration)
    }

    public getConnection(): mysql.Connection {
        return this.connection
    }
    public connect(): void {
        this.connection.connect(error => { if (error) throw error })
    }
    public end(): void {
        this.connection.end(error => { if (error) throw error })
    }
    public query(queryString: string, parameters: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, parameters, (error, result) => {
                // TODO: error handling for the SQL
                if (error) reject(error.message)

                resolve(result)
            })
        })
    }
}

export function connect(database: MySqlDatabase): MySqlDatabase {
    database.connect()

    return database
}

export function createEntriesTable(database: MySqlDatabase): void {
    database.query(`
        CREATE TABLE IF NOT EXISTS entries (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            poster_id VARCHAR(256),
            poster TEXT,
            message TEXT
        );`
    )
}

// TODO: investigate deeper if this is going to cause sync issues
export function syncZoneWithNode(database: MySqlDatabase): void {
    const offset = Math.abs(new Date().getTimezoneOffset() / 60)

    database.query(`SET time_zone = '+${offset < 10 ? '0' + offset : offset}:00';`)
}