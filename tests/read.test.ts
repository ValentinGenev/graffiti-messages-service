import dotenv from 'dotenv'
import { database } from '../src/index'
import { readMessages, readMessage } from '../src/actions/read'
import { ERRORS } from '../src/utilities/constants'

dotenv.config()

describe('Read service tests:', () => {
    const posterId = 'randomfingerprintstring_test_read'

    beforeAll(async () => {
        await database.query(`
            INSERT
                INTO ${process.env.DB_NAME}.messages (poster_id, poster, message)
                VALUES (?, 'Jon Doe', 'Test message');`,
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
    test('readMessage()', async () => {
        const response = await readMessage(posterId)

        expect(response.success).toBeTruthy()
        expect(response.message).toBeDefined()
        expect(response.message && response.message.poster_id === posterId).toBeTruthy()
    })
    test('readMessage() fails with bad posterId', async () => {
        const response = await readMessage('badposterid')

        expect(response.success).toBeFalsy()
        expect(response.error).toBeDefined()
        expect(response.error && response.error.code === ERRORS.notFound).toBeTruthy()
    })
    test('readMessage() fails without posterId', async () => {
        const response = await readMessage('')

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