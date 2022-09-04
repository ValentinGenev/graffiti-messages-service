import * as MessagesDal from '../dal/Messages';
import * as TagsDal from '../dal/Tags';
import * as Request from '../interfaces/IRequest';
import * as Response from '../interfaces/IResponse';
import { isBlank } from '../utilities/helper-functions';

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_POSTS_PER_PAGE = 20

export function parsePaginationData(query: Record<string, any>): Request.Pagination {
    return {
        pageIndex: isBlank(query.pageIndex) ?
            DEFAULT_PAGE_INDEX : Number(query.pageIndex),
        postsPerPage: isBlank(query.postsPerPage) ?
            DEFAULT_POSTS_PER_PAGE : Number(query.postsPerPage)
    }
}

export async function getPaginationData(pagination: Request.Pagination, query: Record<string, any>): Promise<Response.Pagination> {
    const { pageIndex, postsPerPage } = pagination

    const allPostsCount = await count(query)
    const postsCount = await countPostsPerPage(pagination, allPostsCount)
    const pagesCount = Math.ceil(allPostsCount / postsPerPage)

    const paginationData: Response.Pagination = {
        pageIndex,
        postsCount,
        pagesCount
    }
    if (pageIndex !== pagesCount) {
        paginationData.nextPageIndex = pageIndex + 1
    }
    if (pageIndex !== 1) {
        paginationData.previousPageIndex = pageIndex - 1
    }

    return paginationData
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

async function countPostsPerPage(pagination: Request.Pagination, allPostsCount: number): Promise<number> {
    const { pageIndex, postsPerPage } = pagination
    const pagesCount = Math.ceil(allPostsCount / postsPerPage)
    const isLastPage = pageIndex === pagesCount
    const lastPageCount = allPostsCount - (pagesCount - 1) * postsPerPage

    return isLastPage ? lastPageCount : postsPerPage
}