import { database } from '../../src/index'
import { posterId, tagNames } from '../mock/data'
import * as Messages from '../../src/dal/Messages'
import * as Tags from '../../src/dal/Tags'

describe('Tags DAL tests:', () => {
    let newMessage: Record<string, any>

    beforeAll(async () => {
        newMessage = await Messages.insert({ poster_id: posterId, message: 'Hello, world!' })
    })

    test('insert(name)', async () => {
        const result = await Tags.insert(tagNames)
        expect(result.affectedRows === tagNames.length).toBeTruthy()
    })
    test('selectAllByNames(name)', async () => {
        const result = await Tags.selectAllByNames(tagNames)
        expect(result.length === tagNames.length).toBeTruthy()
    })
    test('selectAllByNames(badName) returns empty array', async () => {
        const result = await Tags.selectAllByNames(['Test Tag 2'])
        expect(result.length === 0).toBeTruthy()
    })

    test('relateTagsAndMessages(messageId, tagId) inserts in messages_tags table', async () => {
        const result = await Tags.relateTagsAndMessages(newMessage.insertId, tagNames)
        expect(result.affectedRows === tagNames.length).toBeTruthy()
    })
    test('selectAllByMessage(messageId)', async () => {
        const result = await Tags.selectAllByMessage(newMessage.insertId)
        expect(result.length === tagNames.length).toBeTruthy()
    })
    test('selectAllByMessage(badMessageId) returns empty array', async () => {
        const result = await Tags.selectAllByMessage(-1)
        expect(result.length === 0).toBeTruthy()
    })

    test('countMessagesWithTag()', async () => {
        const result = await Tags.countMessagesWithTag(tagNames[0])
        expect(result === 1).toBeTruthy()
    })
    test('countMessagesWithTag(badTagName)', async () => {
        const result = await Tags.countMessagesWithTag('badTagName')
        expect(result === 0).toBeTruthy()
    })

    afterAll(async () => {
        const databaseName = database.getConnection().config.database
        const tagNamesString = tagNames.map(name => database.escape(name)).join(',')

        await database.query(`
            DELETE
                FROM ${databaseName}.messages
                WHERE poster_id = '${posterId}'`
        )
        await database.query(`
            DELETE
                FROM ${databaseName}.tags
                WHERE name IN (${tagNamesString})`
        )
        database.end()
    })
})