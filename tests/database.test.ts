import dotenv from 'dotenv'
import { database } from '../src/index'

dotenv.config()

describe('Database tests:', () => {
	test('create message', async () => {
        const result = await database.query(`
            INSERT
                INTO ${process.env.DB_NAME}.messages (poster_id, message)
                VALUES ('randomfingerprintstring_test_database', 'Hello, world!');`
        )

        expect(result.affectedRows === 1).toBeTruthy()
	})
    test('get message', async () => {
        const result = await database.query(`
            SELECT *
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = ?;`,
            ['randomfingerprintstring_test_database']
        )

        expect(result[0].message === 'Hello, world!').toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = ?`,
            ['randomfingerprintstring_test_database']
        )
        database.end()
    })
})