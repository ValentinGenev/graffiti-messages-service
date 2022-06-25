import * as Dal from "../dal/select"
import { GetMessageResp, GetMessagesReq, GetMessagesResp, Message } from "../interfaces/IMessage";
import * as IReq from "../interfaces/IRequest";
import * as IRes from "../interfaces/IResponse";
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
    let messages = await Dal.selectMessages(pagination)


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
        pagination: await getPaginationData(pagination)
    }
}

export async function readMessageByPoster(id: string): Promise<GetMessageResp> {
    if (id === '') {
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

async function getTagsOfMessages(messages: Message[]): Promise<Message[]> {
    const messagesWithTags = [...messages]

    for (const message of messagesWithTags) {
        if (message.id)
            message.tags = (await Dal.selectTagsByMessage(message.id)).map(tag => tag.name)
    }

    return messagesWithTags
}