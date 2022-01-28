import dotenv from 'dotenv'
import { database } from '../src'
import { Message } from '../src/interfaces/IMessage'
import { createMessage, isSpam, sanitizeHtml } from '../src/actions/create'
import { ERRORS } from '../src/utilities/constants'

dotenv.config()

describe('Create service tests:', () => {
    const data: Message = {
        poster_id: 'randomfingerprintstring_test_create',
        poster: 'Jon Doe',
        message: '<script>Test message</script>'
    }

    test('createMessage()', async () => {
        const response = await createMessage(data)

        expect(response.success).toBeTruthy()
        expect(response.message).toBeDefined()
        expect(response.message && response.message.message === 'Test message').toBeTruthy()
    })
    test('createMessage() fails withing the spam timeout', async () => {
        const response = await createMessage(data)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === ERRORS.tooManyRequests).toBeTruthy()
    })
    test('createMessage() fails without message', async () => {
        data.message = ''
        const response = await createMessage(data)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === ERRORS.missingData).toBeTruthy()
    })

    test('isSpam()', async () => {
        expect(await isSpam(data.poster_id)).toBeTruthy()
    })
    test('sanitizeHtml()', async () => {
        expect(sanitizeHtml('<style>test</style>') === 'test').toBeTruthy()
        expect(sanitizeHtml('<style><style>test</style></style>') === 'test').toBeTruthy()
        expect(sanitizeHtml('<style><script src="myScript.js">test</script></style>') === 'test').toBeTruthy()
        expect(sanitizeHtml('<iframe src="">test</iframe>') === 'test').toBeTruthy()
        expect(sanitizeHtml('<link rel="stylesheet" href="styles.css">') === '').toBeTruthy()
    })

    afterAll(async () => {
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = ?`,
            ['randomfingerprintstring_test_create']
        )
        database.end()
    })
})