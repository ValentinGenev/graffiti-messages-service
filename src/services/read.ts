
import * as Dal from "../dal/select"
import { GetMessageResp, GetMessagesReq, GetMessagesResp, Message } from "../interfaces/IMessage";
import * as IReq from "../interfaces/IRequest";
import * as IRes from "../interfaces/IResponse";
import { ERRORS } from "../utilities/constants";

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_POSTS_PER_PAGE = 20

export async function readMessages(request: GetMessagesReq): Promise<GetMessagesResp> {
    // TODO: limit the amount of messages per request
    const pagination = parsePaginationData(request)
    let filter: IReq.Filter = {}
    // TODO: write tests for this filter
    let messages = request.tag ?
        await Dal.selectMessagesByTag(request.tag, pagination) :
        await Dal.selectMessages(pagination)

    // TODO: write tests for this filter as well
    if (request.tag) {
        filter.tag = request.tag
    }

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: ERRORS.notFound
            }
        }
    }

    messages = await getTagsOfMessages(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, filter)
    }
}

export async function readMessageByPoster(id: string): Promise<GetMessageResp> {
    if (!id) {
        return {
            success: false,
            error: {
                code: ERRORS.missingData,
                message: 'Missing data: id'
            }
        }
    }

    const message = await Dal.selectLatestMessageByPoster(id)

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

function parsePaginationData(request: GetMessagesReq) {
    return {
        pageIndex: request.pageIndex && request.pageIndex.toString() !== '0' ?
            Number(request.pageIndex) : DEFAULT_PAGE_INDEX,
        postsPerPage: request.postsPerPage ?
            Number(request.postsPerPage) : DEFAULT_POSTS_PER_PAGE
    }
}

// TODO: test this
// TODO: think about abstraction; this started getting complex
async function getPaginationData(pagination: IReq.Pagination, filter: IReq.Filter): Promise<IRes.Pagination> {
    const pageIndex = pagination.pageIndex ? pagination.pageIndex : DEFAULT_PAGE_INDEX
    const postsPerPage = pagination.postsPerPage ? pagination.postsPerPage : DEFAULT_POSTS_PER_PAGE

    const postsCount = await countPosts(filter)
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

async function countPosts(filter?: IReq.Filter): Promise<number> {
    if (filter?.tag) {
        return await Dal.countPostsWithTag(filter.tag)
    }

    return await Dal.countPosts()
}

async function getTagsOfMessages(messages: Message[]): Promise<Message[]> {
    const messagesWithTags = [...messages]

    for (const message of messagesWithTags) {
        if (message.id)
            message.tags = (await Dal.selectTagsByMessage(message.id)).map(tag => tag.name)
    }

    return messagesWithTags
}