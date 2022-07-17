import dotenv from 'dotenv'
import mysql from 'mysql'
import { insertMessage, insertTags, relateTagsAndMessages } from '../src/dal/insert'
import { selectMessagesByTag, selectTagsByMessage, selectTagsByNames } from '../src/dal/select'
import { database } from '../src/index'

dotenv.config()

describe('DAL tests:', () => {
    const posterId = 'randomfingerprintstring_test_database'
    const tagNames = ['Test Label 0', 'Test Label 1', "' or 1=1; drop table graffiti.messages; —"]
    let messageInsert: mysql.OkPacket

	test('insertMessage()', async () => {
        messageInsert = await insertMessage({ poster_id: posterId, message: 'Hello, world!' })
        expect(messageInsert.affectedRows === 1).toBeTruthy()
	})

    // TODO: add selectMessages tests

    test('insertTags()', async () => {
        const result = await insertTags(tagNames)
        expect(result.affectedRows === tagNames.length).toBeTruthy()
    })
    test('selectTagsByNames()', async () => {
        const result = await selectTagsByNames(tagNames)
        expect(result.length === tagNames.length).toBeTruthy()
    })
    test('selectTagsByNames fails with wrong tag()', async () => {
        const result = await selectTagsByNames(['Test Label 2'])
        expect(result.length).toBeFalsy()
    })

    test('relateTagsAndMessages()', async () => {
        const result = await relateTagsAndMessages(messageInsert.insertId, tagNames)
        expect(result.affectedRows === tagNames.length).toBeTruthy()
    })

    test('selectMessagesByTag()', async () => {
        const result = await selectMessagesByTag(tagNames[0], { pageIndex: 1, postsPerPage: 10 })
        expect(result[0].poster_id === posterId).toBeTruthy()
    })
    test('selectMessagesByTag returns empty array with wrong tag()', async () => {
        const result = await selectMessagesByTag('nonExistingTag', { pageIndex: 1, postsPerPage: 10 })
        expect(result.length).toBeFalsy()
    })
    test('selectTagsByMessage()', async () => {
        const result = await selectTagsByMessage(messageInsert.insertId)
        expect(result.length === tagNames.length).toBeTruthy()
    })

    afterAll(async () => {
        const tagNamesString = tagNames.map(name => mysql.escape(name)).join(',')

        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.messages
                WHERE poster_id = '${posterId}'`
        )
        await database.query(`
            DELETE
                FROM ${process.env.DB_NAME}.tags
                WHERE name IN (${tagNamesString})`
        )
        database.end()
    })
})