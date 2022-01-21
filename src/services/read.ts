import * as Dal from "../dal/select"
import { GetMessageResp, GetMessagesReq, GetMessagesResp } from "../interface/IMessage";
import * as IReq from "../interface/IRequest";
import * as IRes from "../interface/IResponse";
import { ERRORS } from "../utilities/constants";

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_POSTS_PER_PAGE = 20

export async function readMessages(request: GetMessagesReq): Promise<GetMessagesResp> {
    const pagination = {
        pageIndex: request.pageIndex && request.pageIndex.toString() !== '0' ?
            Number(request.pageIndex) : DEFAULT_PAGE_INDEX,
        postsPerPage: request.postsPerPage ?
            Number(request.postsPerPage) : DEFAULT_POSTS_PER_PAGE
    }
    const messages = await Dal.selectMessages(pagination)


    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: ERRORS.notFound
            }
        }
    }

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination)
    }
}

export async function readMessage(posterId: string): Promise<GetMessageResp> {
    if (posterId === '') {
        return {
            success: false,
            error: {
                code: ERRORS.missingData,
                message: 'Missing data: posterId'
            }
        }
    }

    const message = await Dal.selectMessage(posterId)

    if (message.length === 0) {
        return {
            success: false,
            error: {
                code: ERRORS.notFound
            }
        }
    }

    return { success: true, message: message[0] }
}

async function getPaginationData(pagination: IReq.Pagination): Promise<IRes.Pagination> {
    const pageIndex = pagination.pageIndex ? pagination.pageIndex : DEFAULT_PAGE_INDEX
    const postsPerPage = pagination.postsPerPage ? pagination.postsPerPage : DEFAULT_POSTS_PER_PAGE

    const postsCount = await Dal.countPosts()
    const pagesCount = Math.ceil(postsCount / postsPerPage)
    const isLastPage = pageIndex === pagesCount
    const lastPageCount = postsCount - (pagesCount - 1) * postsPerPage

    const paginationData: IRes.Pagination = {
        pageIndex,
        postsCount: isLastPage ? lastPageCount : postsPerPage,
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