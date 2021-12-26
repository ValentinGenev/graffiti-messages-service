import dotenv from 'dotenv'
import * as _database from '../src/lib/database'

dotenv.config()

describe('database test', () => {
    let database: _database.MySqlDatabase

	beforeAll(async () => {
        database = new _database.MySqlDatabase({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        })

        await _database.connect(database)
        await _database.setDatabase(database)
	})

	test('create message', async () => {
        const result = await database.query(`
            INSERT
                INTO messages.entries (poster_id, poster, message)
                VALUES ('asd', 'Jon Doe', 'Hello, world!');`
        )

        expect(result.affectedRows === 1).toBeTruthy()
	})
    test('get message', async () => {
        const result = await database.query(`
            SELECT *
                FROM messages.entries
                WHERE poster_id = ?;`,
            ['asd']
        )

        expect(result[0].message === 'Hello, world!').toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM messages.entries
                WHERE poster_id = ?`,
            ['asd']
        )
        await database.end()
    })
})