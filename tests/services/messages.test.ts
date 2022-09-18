// FIXME: run the database setup only for the DAL tests
import { database } from '../../src'
import * as Pagination from '../../src/utilities/pagination'
import * as Links from '../../src/utilities/links'
import * as MessagesDal from '../../src/dal/Messages'
import * as Tags from '../../src/services/Tags'
import * as Messages from '../../src/services/Messages'
import { Codes } from '../../src/utilities/http-responses'
import { oldMessage, message, pagination, messageWithEmptyMessage, spamMessage,
    messageHugeMessage, messageWithTags, messageWithLinks, paginationFilter,
    posterFilter, tagFilter, messageId } from '../mock/data'

describe('Messages service tests:', () => {
    describe('create() suite', () => {
        test('create(messageWithEmptyMessage) throws MissingData', async () => {
            const response = await Messages.create(messageWithEmptyMessage)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.MissingData).toBeTruthy()
        })

        test('create(messageHugeMessage) throws MaxLengthExceeded', async () => {
            const response = await Messages.create(messageHugeMessage)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.MaxLengthExceeded).toBeTruthy()
        })

        test('create(spamMessage) throws TooManyRequests', async () => {
            jest.spyOn(MessagesDal, 'selectLastByPoster').mockResolvedValue([spamMessage])
            jest.spyOn(MessagesDal, 'insert').mockResolvedValue({ insertId: -1 })

            const response = await Messages.create(message)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.TooManyRequests).toBeTruthy()
        })

        test('create(message)', async () => {
            jest.spyOn(MessagesDal, 'selectLastByPoster').mockResolvedValue([oldMessage])
            jest.spyOn(MessagesDal, 'insert').mockResolvedValue({ insertId: -1 })

            const response = await Messages.create(message)

            expect(response.success).toBeTruthy()
            expect(response.message?.message === message.message).toBeTruthy()
        })

        test('create(messageWithTags)',async () => {
            jest.spyOn(MessagesDal, 'selectLastByPoster').mockResolvedValue([oldMessage])
            jest.spyOn(MessagesDal, 'insert').mockResolvedValue({ insertId: -1 })
            jest.spyOn(Tags, 'relateToMessage').mockResolvedValue({ success: true })

            const response = await Messages.create(messageWithTags)

            expect(response.success).toBeTruthy()
        })
    })

    describe('getAll() suite', () => {
        test('getAll(paginationFilter)', async () => {
            jest.spyOn(MessagesDal, 'selectAll').mockResolvedValue([message])
            jest.spyOn(Tags, 'addToMessages').mockResolvedValue([messageWithTags])
            jest.spyOn(Links, 'addSelfLink').mockReturnValue([messageWithLinks])
            jest.spyOn(Pagination, 'create').mockResolvedValue(pagination)

            const response = await Messages.getAll(paginationFilter)
            if (!response.messages) {
                throw new Error("No messages")
            }
            const single = response.messages[0]

            expect(response.success).toBeTruthy()
            expect(response.messages.length > 0).toBeTruthy()
            expect(single._embedded?.tags && single._embedded.tags.length > 0)
                .toBeTruthy()
            expect(single._links?.self?.href === `/messages/${messageId}`)
                .toBeTruthy()
            expect(response.pagination?.pageIndex === 1).toBeTruthy()
        })

        test('getAll(filter) throws NotFound', async () => {
            jest.spyOn(MessagesDal, 'selectAll').mockResolvedValue([])

            const response = await Messages.getAll(paginationFilter)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.NotFound).toBeTruthy()
        })
    })

    describe('getAllByPosterId() suite', () => {
        test('getAllByPosterId(posterFilter)', async () => {
            jest.spyOn(MessagesDal, 'selectAllByPoster').mockResolvedValue([message])
            jest.spyOn(Tags, 'addToMessages').mockResolvedValue([messageWithTags])
            jest.spyOn(Links, 'addSelfLink').mockReturnValue([messageWithLinks])
            jest.spyOn(Pagination, 'create').mockResolvedValue(pagination)

            const response = await Messages.getAllByPosterId(posterFilter)
            if (!response.messages) {
                throw new Error("No messages")
            }
            const single = response.messages[0]

            expect(response.success).toBeTruthy()
            expect(response.messages.length > 0).toBeTruthy()
            expect(single._embedded?.tags && single._embedded.tags.length > 0)
                .toBeTruthy()
            expect(single._links?.self?.href === `/messages/${messageId}`)
                .toBeTruthy()
            expect(response.pagination?.pageIndex === 1).toBeTruthy()
        })

        test('getAllByPosterId(paginationFilter) throws NotFound', async () => {
            const response = await Messages.getAllByPosterId(paginationFilter)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.NotFound).toBeTruthy()
        })
    })

    describe('getAllByTag() suite', () => {
        test ('getAllByTag(tagFilter)',async () => {
            jest.spyOn(MessagesDal, 'selectAllWithTag').mockResolvedValue([message])
            jest.spyOn(Tags, 'addToMessages').mockResolvedValue([messageWithTags])
            jest.spyOn(Links, 'addSelfLink').mockReturnValue([messageWithLinks])
            jest.spyOn(Pagination, 'create').mockResolvedValue(pagination)

            const response = await Messages.getAllByTag(tagFilter)
            if (!response.messages) {
                throw new Error("No messages")
            }
            const single = response.messages[0]

            expect(response.success).toBeTruthy()
            expect(response.messages.length > 0).toBeTruthy()
            expect(single._embedded?.tags && single._embedded.tags.length > 0)
                .toBeTruthy()
            expect(single._links?.self?.href === `/messages/${messageId}`)
                .toBeTruthy()
            expect(response.pagination?.pageIndex === 1).toBeTruthy()
        })

        test('getAllByTag(paginationFilter) throws NotFound', async () => {
            const response = await Messages.getAllByTag(paginationFilter)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.NotFound).toBeTruthy()
        })
    })

    describe('getById() suite', () => {
        test ('getById(id)',async () => {
            jest.spyOn(MessagesDal, 'selectById').mockResolvedValue([message])
            jest.spyOn(Tags, 'addToMessages').mockResolvedValue([messageWithTags])

            const response = await Messages.getById(messageId)

            expect(response.success).toBeTruthy()
            expect(response.message?._embedded?.tags &&
                response.message._embedded.tags.length > 0).toBeTruthy()
        })

        test('getById(badId) throws NotFound', async () => {
            jest.spyOn(MessagesDal, 'selectById').mockResolvedValue([])

            const response = await Messages.getById(messageId - 2)

            expect(response.success).toBeFalsy()
            expect(response.error?.code === Codes.NotFound).toBeTruthy()
        })
    })

    afterAll(() => {
        database.end()
    })
})