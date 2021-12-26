import dotenv from 'dotenv'
import * as database from '../src/lib/database'

dotenv.config()

describe('database test', () => {
    let connection: database.MySqlConnection

	beforeAll(async () => {
        connection = database.connect({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        })
        await database.setDatabase(connection)
	})

	test('create message', async () => {
        const result = await connection.query(`
            INSERT
                INTO messages.entries (poster_id, poster, message)
                VALUES ('asd', 'Jon Doe', 'Hello, world!');`
        )

        expect(result.affectedRows === 1).toBeTruthy()
	})
    test('get message', async () => {
        const result = await connection.query(`
            SELECT *
                FROM messages.entries
                WHERE poster_id = ?;`,
            ['asd']
        )

        expect(result[0].message === 'Hello, world!').toBeTruthy()
    })

    afterAll(async () => {
        await connection.query(`
            DELETE
                FROM messages.entries
                WHERE poster_id = ?`,
            ['asd']
        )
        await connection.end()
    })
})