import { database } from '../../src/index'
import { posterId, paginationFilter, tagNamesForMessages } from '../mock/data'
import * as Messages from '../../src/dal/Messages'
import * as Tags from '../../src/dal/Tags'

describe('Messages DAL tests:', () => {
    let newMessage: Record<string, any>

    beforeAll(async () => {
        await Tags.insert(tagNamesForMessages)
    })

    test('insert(data)', async () => {
        newMessage = await Messages.insert({ poster_id: posterId,
            message: "Hello, world!" })
        expect(newMessage.affectedRows === 1).toBeTruthy()
    })

    test('selectAll(pagination)', async () => {
        const result = await Messages.selectAll(paginationFilter)

        expect(result.length !== 0).toBeTruthy()
    })
    test('selectAllByPoster(posterId, pagination)', async () => {
        const result = await Messages.selectAllByPoster(posterId, paginationFilter)

        expect(result.length !== 0).toBeTruthy()
    })
    test('selectLastByPoster(posterId)', async () => {
        const result = await Messages.selectLastByPoster(posterId)

        expect(result.length === 1).toBeTruthy()
    })
    test('selectAllWithTag(name, pagination)', async () => {
        await Tags.relateTagsAndMessages(newMessage.insertId, tagNamesForMessages)

        const result = await Messages.selectAllWithTag(tagNamesForMessages[0],
            paginationFilter)

        expect(result.length !== 0).toBeTruthy()
    })

    test('count()', async () => {
        const result = await Messages.count()
        expect(result !== 0).toBeTruthy
    })
    test('countByPoster(posterId)', async () => {
        const result = await Messages.countByPoster(posterId)
        expect(result !== 0).toBeTruthy
    })

    afterAll(async () => {
        const databaseName = database.getConnection().config.database
        const tagNamesString = tagNamesForMessages.map(name =>
            database.escape(name)).join(',')

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