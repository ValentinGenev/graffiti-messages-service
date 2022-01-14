import { database } from '../src/index'
import { readMessages, readMessage } from '../src/services/read'
import { ERRORS } from '../src/utilities/constants'

describe('Service tests:', () => {
    const posterId = 'randomfingerprintstring_test_read'

    beforeAll(async () => {
        await database.query(`
            INSERT
                INTO messages.entries (poster_id, poster, message)
                VALUES (?, 'Jon Doe', 'Test message');`,
            [posterId]
        )
    })

	test('readMessages()', async () => {
        const result = await readMessages()

        expect(result.success).toBeTruthy()
        expect(result.messages && result.messages.length > 0).toBeTruthy()
    })
    test('readMessage()', async () => {
        const result = await readMessage(posterId)

        expect(result.success).toBeTruthy()
        expect(result.message).toBeDefined()
        expect(result.message && result.message.poster_id === posterId).toBeTruthy()
    })
    test('readMessage() fails with bad posterId', async () => {
        const result = await readMessage('badposterid')

        expect(result.success).toBeFalsy()
        expect(result.error).toBeDefined()
        expect(result.error && result.error.code === ERRORS.notFound).toBeTruthy()
    })
    test('readMessage() fails without posterId', async () => {
        const result = await readMessage('')

        expect(result.success).toBeFalsy()
        expect(result.error).toBeDefined()
        expect(result.error && result.error.code === ERRORS.missingData).toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM messages.entries
                WHERE poster_id = ?`,
            [posterId]
        )
        database.end()
    })
})