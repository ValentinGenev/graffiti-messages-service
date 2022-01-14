import { database } from '../src/index'

describe('Database tests:', () => {
	test('create message', async () => {
        const result = await database.query(`
            INSERT
                INTO messages.entries (poster_id, poster, message)
                VALUES ('randomfingerprintstring_test_database', 'Jon Doe', 'Hello, world!');`
        )

        expect(result.affectedRows === 1).toBeTruthy()
	})
    test('get message', async () => {
        const result = await database.query(`
            SELECT *
                FROM messages.entries
                WHERE poster_id = ?;`,
            ['randomfingerprintstring_test_database']
        )

        expect(result[0].message === 'Hello, world!').toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM messages.entries
                WHERE poster_id = ?`,
            ['randomfingerprintstring_test_database']
        )
        database.end()
    })
})