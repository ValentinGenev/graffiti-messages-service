import { database } from '../src'
import * as Tags from '../src/services/Tags'
import * as Pagination from '../src/services/pagination'
import * as MessagesDal from '../src/dal/Messages'
import * as Messages from '../src/services/Messages'
import { Codes } from '../src/utilities/http-responses'
import { oldMessageData, messageData, pagination, filter } from './mock/data'

describe('Read service tests:', () => {
    test('create(messageData)', async () => {
        jest.spyOn(MessagesDal, 'selectLastByPoster').mockResolvedValue([oldMessageData])
        jest.spyOn(MessagesDal, 'insert').mockResolvedValue({ insertId: -1 })

        const response = await Messages.create(messageData)

        expect(response.success).toBeTruthy()
        expect(response.message?.message === messageData.message).toBeTruthy()
    })
    test('create(spamMessageData)', async () => {
        jest.spyOn(MessagesDal, 'selectLastByPoster').mockResolvedValue([messageData])
        jest.spyOn(MessagesDal, 'insert').mockResolvedValue({ insertId: -1 })

        const response = await Messages.create(messageData)

        console.log(response)

        expect(response.success).toBeTruthy()
        expect(response.message?.message === messageData.message).toBeTruthy()
    })

	test('getAll(filter)', async () => {
        jest.spyOn(MessagesDal, 'selectAll').mockResolvedValue([messageData])
        jest.spyOn(Tags, 'addToMessages').mockResolvedValue([messageData])
        jest.spyOn(Pagination, 'getPaginationData').mockResolvedValue(pagination)

        const response = await Messages.getAll(filter)

        expect(response.success).toBeTruthy()
        expect(response.messages && response.messages.length > 0).toBeTruthy()
        expect(response.pagination && response.pagination.pageIndex === 1).toBeTruthy()
    })

    // test('getAll() fails bad pageIndex', async () => {
    //     const response = await Messages.getAll({ query: { pageIndex: '999', postsPerPage: undefined } })

    //     expect(response.success).toBeFalsy()
    //     expect(response.error && response.error.code === Codes.NotFound).toBeTruthy()
    // })

    // test('getByPoster()', async () => {
    //     const response = await Messages.getByPoster(posterId)

    //     expect(response.success).toBeTruthy()
    //     expect(response.message).toBeDefined()
    //     expect(response.message && response.message.poster_id === posterId).toBeTruthy()
    // })
    // test('getByPoster() fails with bad posterId', async () => {
    //     const response = await Messages.getByPoster('badposterid')

    //     expect(response.success).toBeFalsy()
    //     expect(response.error).toBeDefined()
    //     expect(response.error && response.error.code === Codes.NotFound).toBeTruthy()
    // })
    // test('getByPoster() fails without posterId', async () => {
    //     const response = await Messages.getByPoster('')

    //     expect(response.success).toBeFalsy()
    //     expect(response.error).toBeDefined()
    //     expect(response.error && response.error.code === Codes.MissingData).toBeTruthy()
    // })

    afterAll(() => {
        database.end()
    })
})