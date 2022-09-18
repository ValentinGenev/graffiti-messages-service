// FIXME: run the database setup only for the DAL tests
import { database } from '../../src'
import * as Tags from '../../src/services/Tags'
import * as TagsDal from '../../src/dal/Tags'
import { message, pagination, tag, tagNames } from '../mock/data'

describe('Tags service tests:', () => {
    test('relateToMessage(tagNames, messageId)', async () => {
        jest.spyOn(TagsDal, 'selectAllByNames').mockResolvedValue([tag])
        jest.spyOn(TagsDal, 'insert').mockResolvedValue({ insertId: -1 })
        jest.spyOn(TagsDal, 'relateTagsAndMessages').mockResolvedValue({ insertId: -1 })

        const result = await Tags.relateToMessage(tagNames, 1)

        expect(result.success).toBeTruthy()
    })

    test('addToMessages(messages)', async () => {
        jest.spyOn(TagsDal, 'selectAllByMessage').mockResolvedValue([tag])

        const result = await Tags.addToMessages([message], pagination)

        expect(result[0]._embedded?.tags && result[0]._embedded.tags.length > 0)
            .toBeTruthy()
    })

    afterAll(() => {
        database.end()
    })
})