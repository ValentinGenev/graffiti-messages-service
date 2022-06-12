import dotenv from 'dotenv'
import { insertTags } from '../src/dal/insert'
import { selectTagsByName } from '../src/dal/select'
import { database } from '../src/index'

dotenv.config()

describe('Tag related database tests:', () => {
    const userId = 'randomfingerprintstring_test_database'
    const tagNames = ['Test Label 0', 'Test Label 1']

	test('create message', async () => {
        const result = await database.query(`
            INSERT
                INTO ${process.env.DB_NAME}.messages (poster_id, message)
                VALUES ('${userId}', 'Hello, world!');`
        )

        expect(result.affectedRows === 1).toBeTruthy()
	})

    test('insertTags', async () => {
        const result = await insertTags(tagNames)

        expect(result.affectedRows === 2).toBeTruthy()
    })
    test('selectTagsByName', async () => {
        const result = await selectTagsByName(tagNames)

        expect(result.length === 2).toBeTruthy()
    })
    test('selectTagsByName fails with wrong tag', async () => {
        const result = await selectTagsByName(['Test Label 2'])

        expect(result.length).toBeFalsy()
    })

    afterAll(async () => {
        const tagNamesString = tagNames.map(name => `'${name}'`).join(',')

        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = '${userId}'`
        )
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.tags
                WHERE name IN (${tagNamesString})`
        )
        database.end()
    })
})