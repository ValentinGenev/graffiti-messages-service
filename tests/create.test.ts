import { database } from '../src'
import { Message } from '../src/interface/IMessage'
import { createMessage } from '../src/services/create'
import { ERRORS } from '../src/utilities/constants'

describe('Create service tests:', () => {
    const data: Message = {
        poster_id: 'randomfingerprintstring_test_create',
        poster: 'Jon Doe',
        message: 'Test message'
    }

    test('createMessage()', async () => {
        const response = await createMessage(data)

        expect(response.success).toBeTruthy()
        expect(response.message).toBeDefined()
    })
    test('createMessage() should fail withing the spam timeout', async () => {
        const response = await createMessage(data)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === ERRORS.tooManyRequests).toBeTruthy()
    })
    test('createMessage() should fail without message', async () => {
        data.message = ''
        const response = await createMessage(data)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === ERRORS.missingData).toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM messages.entries
                WHERE poster_id = ?`,
            ['randomfingerprintstring_test_create']
        )
        database.end()
    })
})