// FIXME: run the database setup only for the DAL tests
import { database } from '../../src'
import { addSelfLink, addTagsLinks, addPaginationLinks }
    from '../../src/utilities/links'
import { message, messageId, pagination, paginationWithNext,
    paginationWithPrevious, tag, tagFilter } from '../mock/data'

describe('Links functions tests:', () => {
    test('addSelfLink(messages)', () => {
        const result = addSelfLink([message])

        expect(result[0]._links?.self?.href === `/messages/${messageId}`)
            .toBeTruthy()
    })

    test('addTagsLinks(tags)', () => {
        const { postsPerPage } = pagination
        const result = addTagsLinks([tag], postsPerPage)

        expect(result[0].name === tag.name).toBeTruthy()
        expect(result[0].href ===
                `/messages/?tag=${tag.name}&postsPerPage=${postsPerPage}`)
            .toBeTruthy()
    })

    test('addPaginationLinks(paginationWithNext)', () => {
        const { postsPerPage, nextPageIndex } = paginationWithNext
        const result = addPaginationLinks(paginationWithNext, tagFilter)

        expect(result.next?.name === 'Next page').toBeTruthy()
        expect(result.next?.href ===
                `/messages/?pageIndex=${nextPageIndex}&postsPerPage=${postsPerPage}&tag=${tagFilter.tag}`)
            .toBeTruthy()
    })

    test('addPaginationLinks(paginationWithPrevious)', () => {
        const { postsPerPage, previousPageIndex } = paginationWithPrevious
        const result = addPaginationLinks(paginationWithPrevious, tagFilter)

        expect(result.prev?.name === 'Previous page').toBeTruthy()
        expect(result.prev?.href ===
                `/messages/?pageIndex=${previousPageIndex}&postsPerPage=${postsPerPage}&tag=${tagFilter.tag}`)
            .toBeTruthy()
    })

    afterAll(() => {
        database.end()
    })
})