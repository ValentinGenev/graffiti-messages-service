import dotenv from 'dotenv'
import { database } from '../src'
import { Message } from '../src/interfaces/IMessage'
import { createMessage, isSpam, relateTagsToMessage } from '../src/actions/create'
import { selectLatestMessageByPoster } from '../src/dal/select'
import { ERRORS } from '../src/utilities/constants'
import { Tag } from '../src/interfaces/ITag'

dotenv.config()

describe('Create service tests:', () => {
    const message: Message = {
        poster_id: 'randomfingerprintstring_test_create',
        message: '<script>Test message</script>'
    }
    const tagNames = ['label 0', 'label 1', 'label 2']

    test('createMessage()', async () => {
        const response = await createMessage(message)

        expect(response.success).toBeTruthy()
        expect(response.message).toBeDefined()
        expect(response.message && response.message.message === 'Test message').toBeTruthy()
    })
    test('createMessage() fails within the spam timeout', async () => {
        const response = await createMessage(message)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === ERRORS.tooManyRequests).toBeTruthy()
    })
    test('createMessage() fails without message', async () => {
        message.message = ''
        const response = await createMessage(message)

        expect(response.success).toBeFalsy()
        expect(response.message).toBeUndefined()
        expect(response.error && response.error.code === ERRORS.missingData).toBeTruthy()
    })

    test('isSpam()', async () => {
        expect(await isSpam(message.poster_id)).toBeTruthy()
    })

    test('relateTagsToMessage', async () => {
        const lastPost = await selectLatestMessageByPoster(message.poster_id)

        if (typeof lastPost[0].id !== 'undefined') {
            const response = await relateTagsToMessage(tagNames, lastPost[0].id)

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