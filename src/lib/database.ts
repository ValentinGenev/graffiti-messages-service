import mysql from 'mysql'

export class MySqlConnection {
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
                if (error) reject(error.message)

                resolve(result)
            })
        })
    }
}

export function connect(configuration: mysql.ConnectionConfig): MySqlConnection {
    const connection = new MySqlConnection(configuration)
    connection.connect()

    return connection
}

export async function setDatabase(connection: MySqlConnection): Promise<void> {
    await createMessagesDatabase(connection)
    await createEntriesTable(connection)
}

function createMessagesDatabase(connection: MySqlConnection): Promise<any> {
    return connection.query(`
        CREATE DATABASE IF NOT EXISTS messages;
        USE messages;`
    )
}

function createEntriesTable(connection: MySqlConnection): Promise<any> {
    return connection.query(`
        CREATE TABLE IF NOT EXISTS entries (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            poster_id VARCHAR(256),
            poster TEXT,
            message TEXT
        );`
    )
}