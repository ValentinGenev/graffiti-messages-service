import dotenv from 'dotenv'
import { OkPacket } from 'mysql'
import { database } from '../src/index'
import { readMessages, readMessageByPoster } from '../src/services/read'
import { insertMessage, insertTags, relateTagsAndMessages } from '../src/dal/insert'
import { Message } from '../src/interfaces/IMessage'
import { Codes } from '../src/utilities/http-responses'

dotenv.config()

describe('Read service tests:', () => {
    const posterId = 'randomfingerprintstring_test_read'
    const tagNames = ['Read Label 0', 'Read Label 1']
    let messageInsert: OkPacket

    beforeAll(async () => {
        messageInsert = await insertMessage({ poster_id: posterId, message: 'Test message' })
        await insertTags(tagNames)
        await relateTagsAndMessages(messageInsert.insertId, tagNames)
    })

	test('readMessages()', async () => {
        const response = await readMessages({ query: { } })

        expect(response.success).toBeTruthy()
        expect(response.messages && response.messages.length > 0).toBeTruthy()
        expect(response.pagination && response.pagination.pageIndex === 1).toBeTruthy()
    })
    test('readMessages() single message', async () => {
        const response = await readMessages({ query: { } })
        let testMessage: Message | undefined = undefined

        if (response.messages) {
            for (const message of response.messages) {
                if (message.id === messageInsert.insertId) {
                    testMessage = message
                }
            }
        }

        expect(typeof testMessage !== 'undefined').toBeTruthy()
        expect(testMessage?.poster_id === posterId).toBeTruthy()
        expect(testMessage?.message === 'Test message').toBeTruthy()
        expect(testMessage?.tags && testMessage?.tags.indexOf(tagNames[0]) >= 0).toBeTruthy()
    })
    test('readMessages() fails bad pageIndex', async () => {
        const response = await readMessages({ query: { pageIndex: '999', postsPerPage: undefined } })

        expect(response.success).toBeFalsy()
        expect(response.error && response.error.code === Codes.NotFound).toBeTruthy()
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
        expect(response.error && response.error.code === Codes.NotFound).toBeTruthy()
    })
    test('readMessageByPoster() fails without posterId', async () => {
        const response = await readMessageByPoster('')

        expect(response.success).toBeFalsy()
        expect(response.error).toBeDefined()
        expect(response.error && response.error.code === Codes.MissingData).toBeTruthy()
    })

    afterAll(async () => {
        const tagNamesString = tagNames.map(name => `'${name}'`).join(',')

        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = ?`,
            [posterId]
        )
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.tags
                WHERE name IN (${tagNamesString})`
        )
        database.end()
    })
})