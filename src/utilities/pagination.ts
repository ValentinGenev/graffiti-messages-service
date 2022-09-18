import * as MessagesDal from '../dal/Messages';
import * as TagsDal from '../dal/Tags';
import * as Request from '../interfaces/IRequest';
import * as Response from '../interfaces/IResponse';
import * as Links from '../utilities/links'
import { isBlank } from './helper-functions';

export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_POSTS_PER_PAGE = 20

export function parseData(query: Record<string, any>): Request.Pagination {
    return {
        pageIndex: isBlank(query.pageIndex) ?
            DEFAULT_PAGE_INDEX : Number(query.pageIndex),
        postsPerPage: isBlank(query.postsPerPage) ?
            DEFAULT_POSTS_PER_PAGE : Number(query.postsPerPage)
    }
}

export async function create(query: Record<string, any>): Promise<Response.Pagination> {
    const paginationData = parseData(query)
    const { pageIndex, postsPerPage } = paginationData
    const allPostsCount = await count(query)
    // TODO: check why I'm not returning the allPostsCount instead of postsCount
    const postsCount = countPostsPerPage(paginationData, allPostsCount)
    const pagesCount = Math.ceil(allPostsCount / postsPerPage)

    const pagination: Response.Pagination = {
        pageIndex, postsCount, pagesCount, postsPerPage, _links: {}
    }
    if (pageIndex !== pagesCount) {
        pagination.nextPageIndex = pageIndex + 1
    }
    if (pageIndex !== 1) {
        pagination.previousPageIndex = pageIndex - 1
    }
    pagination._links = Links.addPaginationLinks(pagination)

    return pagination
}

async function count(query: Record<string, any>): Promise<number> {
    if (!isBlank(query.tag)) {
        return await TagsDal.countMessagesWithTag(query.tag)
    }
    if (!isBlank(query.posterId)) {
        return await MessagesDal.countByPoster(query.posterId)
    }

    return await MessagesDal.count()
}

function countPostsPerPage(pagination: Request.Pagination, allPostsCount: number): number {
    const { pageIndex, postsPerPage } = pagination
    const pagesCount = Math.ceil(allPostsCount / postsPerPage)
    const isLastPage = pageIndex === pagesCount
    const lastPageCount = allPostsCount - (pagesCount - 1) * postsPerPage

    return isLastPage ? lastPageCount : postsPerPage
}

export function getOffset(pagination: Request.Pagination) {
    return pagination.pageIndex && pagination.postsPerPage ?
        (pagination.pageIndex - 1) * pagination.postsPerPage : 0
}