import dotenv from 'dotenv'
import { database } from '../src'
import { Message } from '../src/interfaces/IMessage'
import { selectLatestMessageByPoster } from '../src/dal/select'
import * as Messages from '../src/services/messages'
import * as Tags from '../src/services/tags'
import { Codes } from '../src/utilities/http-responses'

dotenv.config()

describe('Create service tests:', () => {
    const message: Message = {
        poster_id: 'randomfingerprintstring_test_create',
        message: '<script>Test message</script>'
    }
    const tagNames = ['label 0', 'label 1', 'label 2']

    test('create()', async () => {
        const response = await Messages.create(message)

        expect(response.success).toBeTruthy()
        expect(response.message).toBeDefined()
        expect(response.message && response.message.message === 'Test message').toBeTruthy()
    })
    test('create() fails within the spam timeout', async () => {
        const response = await Messages.create(message)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === Codes.TooManyRequests).toBeTruthy()
    })
    test('create() fails without message', async () => {
        message.message = ''
        const response = await Messages.create(message)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === Codes.MissingData).toBeTruthy()
    })

    test('isSpam()', async () => {
        expect(await Messages.isSpam(message.poster_id)).toBeTruthy()
    })

    test('relateToMessage', async () => {
        const lastPost = await selectLatestMessageByPoster(message.poster_id)

        if (typeof lastPost[0].id !== 'undefined') {
            const response = await Tags.relateToMessage(tagNames, lastPost[0].id)

            expect(response.success)
        }
    })

    afterAll(async () => {
        const tagNamesString = tagNames.map(name => `'${name}'`).join(',')

        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = ?`,
            [message.poster_id]
        )
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.tags
                WHERE name IN (${tagNamesString})`
        )
        database.end()
    })
})