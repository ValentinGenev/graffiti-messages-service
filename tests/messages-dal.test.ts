import { database } from '../src/index'
import * as Messages from '../src/dal/Messages'
import * as Tags from '../src/dal/Tags'

describe('Messages DAL tests:', () => {
    const posterId = 'randomfingerprintstring_test_database'
    const pagination = { pageIndex: 1, postsPerPage: 10 }
    const tagNames = ['Test Tag 0']
    let newMessage: Record<string, any>

    beforeAll(async () => {
        await Tags.insert(tagNames)
    })

    test('insert(data)', async () => {
        newMessage = await Messages.insert({ poster_id: posterId,
            message: "Hello, world!" })
        expect(newMessage.affectedRows === 1).toBeTruthy()
    })

    test('selectAll(pagination)', async () => {
        const result = await Messages.selectAll(pagination)
        expect(result.length !== 0).toBeTruthy()
    })
    test('selectAllByPoster(posterId, pagination)', async () => {
        const result = await Messages.selectAllByPoster(posterId, pagination)
        expect(result.length !== 0).toBeTruthy()
    })
    test('selectLastByPoster(posterId)', async () => {
        const result = await Messages.selectLastByPoster(posterId)
        expect(result.length === 1).toBeTruthy()
    })
    test('selectAllWithTag(name, pagination)', async () => {
        await Tags.relateTagsAndMessages(newMessage.insertId, tagNames)
        const result = await Messages.selectAllWithTag(tagNames[0], pagination)
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