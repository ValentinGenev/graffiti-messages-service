import dotenv from 'dotenv'
import { database } from '../src/index'
import { readMessages, readMessageByPoster } from '../src/actions/read'
import { ERRORS } from '../src/utilities/constants'

dotenv.config()

describe('Read service tests:', () => {
    const posterId = 'randomfingerprintstring_test_read'

    beforeAll(async () => {
        await database.query(`
            INSERT
                INTO ${process.env.DB_NAME}.messages (poster_id, message)
                VALUES (?, 'Test message');`,
            [posterId]
        )
    })

	test('readMessages()', async () => {
        const response = await readMessages({ pageIndex: undefined, postsPerPage: undefined })

        expect(response.success).toBeTruthy()
        expect(response.messages && response.messages.length > 0).toBeTruthy()
        expect(response.pagination && response.pagination.pageIndex === 1).toBeTruthy()
    })
    test('readMessages() fails bad pageIndex', async () => {
        const response = await readMessages({ pageIndex: 999, postsPerPage: undefined })

        expect(response.success).toBeFalsy()
        expect(response.error && response.error.code === ERRORS.notFound).toBeTruthy()
    })
    test('readMessageByPoster()', async () => {
        const response = await readMessageByPoster(posterId)

        expect(response.success).toBeTruthy()
        expect(response.message).toBeDefined()
        expect(response.message && response.message.poster_id === posterId).toBeTruthy()
    })
    test('readMessageByPoster() fails with bad posterId', async () => {
        const response = await readMessageByPoster('badposterid')

        expect(response.success).toBeFalsy()
        expect(response.error).toBeDefined()
        expect(response.error && response.error.code === ERRORS.notFound).toBeTruthy()
    })
    test('readMessageByPoster() fails without posterId', async () => {
        const response = await readMessageByPoster('')

        expect(response.success).toBeFalsy()
        expect(response.error).toBeDefined()
        expect(response.error && response.error.code === ERRORS.missingData).toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = ?`,
            [posterId]
        )
        database.end()
    })
})