// FIXME: run the database setup only for the DAL tests
import { database } from '../../src'
import { DEFAULT_PAGE_INDEX, DEFAULT_POSTS_PER_PAGE, parseData, create }
    from '../../src/utilities/pagination'
import { filterWithoutPagination, paginationFilter, posterFilter,
    secondPageFilter, tagFilter } from '../mock/data'
import * as MessagesDal from '../../src/dal/Messages'
import * as TagsDal from '../../src/dal/Tags'

describe('Pagination functions tests:', () => {
    test('parseData(paginationFilter)', () => {
        const { pageIndex, postsPerPage } = paginationFilter
        const result = parseData(paginationFilter)

        expect(result.pageIndex === pageIndex).toBeTruthy()
        expect(result.postsPerPage === postsPerPage).toBeTruthy()
    })

    test('parseData(filterWithoutPagination)', () => {
        const result = parseData(filterWithoutPagination)

        expect(result.pageIndex === DEFAULT_PAGE_INDEX).toBeTruthy()
        expect(result.postsPerPage === DEFAULT_POSTS_PER_PAGE).toBeTruthy()
    })

    describe('create() suite', () => {
        test('create(paginationFilter)', async () => {
            jest.spyOn(MessagesDal, 'count').mockResolvedValue(1)

            const result = await create(paginationFilter)

            expect(MessagesDal.count).toHaveBeenCalled()
            expect(result.pageIndex === 1).toBeTruthy()
            expect(result.postsCount === 1).toBeTruthy()
            expect(result.pagesCount === 1).toBeTruthy()
            expect(result.postsPerPage === 10).toBeTruthy()
            expect(result._links && 'nextPageIndex' in result._links).toBeFalsy()
            expect(result._links && 'previousPageIndex' in result._links).toBeFalsy()
        })

        test('create(posterFilter)', async () => {
            jest.spyOn(MessagesDal, 'countByPoster').mockResolvedValue(1)

            const result = await create(posterFilter)

            expect(MessagesDal.countByPoster).toHaveBeenCalled()
            expect(result.pageIndex === 1).toBeTruthy()
            expect(result.postsCount === 1).toBeTruthy()
            expect(result.pagesCount === 1).toBeTruthy()
            expect(result.postsPerPage === 10).toBeTruthy()
            expect(result._links && 'next' in result._links).toBeFalsy()
            expect(result._links && 'prev' in result._links).toBeFalsy()
        })

        test('create(tagFilter)', async () => {
            jest.spyOn(TagsDal, 'countMessagesWithTag').mockResolvedValue(1)

            const result = await create(tagFilter)

            expect(TagsDal.countMessagesWithTag).toHaveBeenCalled()
            expect(result.pageIndex === 1).toBeTruthy()
            expect(result.postsCount === 1).toBeTruthy()
            expect(result.pagesCount === 1).toBeTruthy()
            expect(result.postsPerPage === 10).toBeTruthy()
            expect(result._links && 'next' in result._links).toBeFalsy()
            expect(result._links && 'prev' in result._links).toBeFalsy()
        })

        test('create(paginationFilter)', async () => {
            jest.spyOn(MessagesDal, 'count').mockResolvedValue(11)

            const result = await create(paginationFilter)

            expect(result.pageIndex === 1).toBeTruthy()
            expect(result.postsCount === 10).toBeTruthy()
            expect(result.pagesCount === 2).toBeTruthy()
            expect(result._links?.next?.name === 'Next page').toBeTruthy()
            expect(result._links?.next?.href ===
                '/messages/?pageIndex=2&postsPerPage=10').toBeTruthy()
        })

        test('create(secondPageFilter)', async () => {
            jest.spyOn(MessagesDal, 'count').mockResolvedValue(21)

            const result = await create(secondPageFilter)

            expect(result.pageIndex === 2).toBeTruthy()
            expect(result.pagesCount === 3).toBeTruthy()
            expect(result._links?.next?.name === 'Next page').toBeTruthy()
            expect(result._links?.next?.href ===
                '/messages/?pageIndex=3&postsPerPage=10').toBeTruthy()
            expect(result._links?.prev?.name === 'Previous page').toBeTruthy()
            expect(result._links?.prev?.href ===
                '/messages/?pageIndex=1&postsPerPage=10').toBeTruthy()
        })
    })

    afterAll(() => {
        database.end()
    })
})