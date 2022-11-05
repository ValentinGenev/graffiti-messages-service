import dotenv from 'dotenv'
import { insert, selectAll, selectAllByPoster, selectLastByPoster, selectAllWithTag, selectById } from '../dal/Messages'
import { Response } from '../interfaces/IResponse'
import { Message, PostMessageResp, GetMessagesResp, GetMessageResp } from '../interfaces/IMessage'
import { Filter } from '../interfaces/IRequest'
import { posterIsSpamming, sanitizeHtml } from '../utilities/helper-functions'
import { CODES, MESSAGES } from '../utilities/http-responses'
import * as Pagination from '../utilities/pagination';
import * as Links from '../utilities/links'
import * as Tags from './Tags'
import { DEFAULT_POSTS_PER_PAGE } from '../utilities/pagination'

dotenv.config()

const NOT_FOUND_RES: Response = {
    success: false,
    error: {
        code: CODES.notFound
    }
}

export async function create(data: Message): Promise<PostMessageResp> {
    if (!data.hasOwnProperty('message') || data.message === '') {
        return {
            success: false,
            error: {
                code: CODES.missingData,
                message: MESSAGES.missingData('message')
            }
        }
    }

    if (data.message.length > Number(process.env.MAX_MESSAGE_LENGTH)) {
        return {
            success: false,
            error: {
                code: CODES.maxLengthExceeded,
                message: MESSAGES.maxLengthExceeded
            }
        }
    }

    if (await isSpam(data.poster_id)) {
        return {
            success: false,
            error: {
                code: CODES.tooManyRequests,
                message: MESSAGES.tooManyRequests(Number(process.env.TIME_LIMIT) / 60000)
            }
        }
    }

    data.message = sanitizeHtml(data.message)
    const newMessage = await insert(data)

    if (data.tags?.length) {
        await Tags.relateToMessage(data.tags, newMessage.insertId)
    }

    return { success: true, message: data }
}

async function isSpam(posterId: string): Promise<boolean> {
    const lastPost = await selectLastByPoster(posterId)

    if (lastPost.length === 1) {
        return posterIsSpamming(lastPost[0], Number(process.env.TIME_LIMIT))
    }

    return false
}

export async function getAll(filter: Filter): Promise<GetMessagesResp> {
    const paginationData = Pagination.parseData(filter)
    let messages = await selectAll(paginationData)

    if (messages.length === 0) {
        return NOT_FOUND_RES
    }

    messages = await Tags.addToMessages(messages, paginationData)
    messages = Links.addSelfLink(messages)

    return {
        success: true,
        messages,
        pagination: await Pagination.create(filter)
    }
}

export async function getAllByPosterId(filter: Filter): Promise<GetMessagesResp> {
    const paginationData = Pagination.parseData(filter)
    let messages: Message[] = []

    if (filter.posterId) {
        messages = await selectAllByPoster(filter.posterId, paginationData)
    }

    if (messages.length === 0) {
        return NOT_FOUND_RES
    }

    messages = await Tags.addToMessages(messages, paginationData)
    messages = Links.addSelfLink(messages)

    return {
        success: true,
        messages,
        pagination: await Pagination.create(filter)
    }

}

export async function getAllByTag(filter: Filter): Promise<GetMessagesResp> {
    const paginationData = Pagination.parseData(filter);
    let messages: Message[] = []

    if (filter.tag) {
        messages = await selectAllWithTag(filter.tag, paginationData)
    }

    if (messages.length === 0) {
        return NOT_FOUND_RES
    }

    messages = await Tags.addToMessages(messages, paginationData)
    messages = Links.addSelfLink(messages)

    return {
        success: true,
        messages,
        pagination: await Pagination.create(filter)
    }
}

export async function getById(id: number): Promise<GetMessageResp> {
    let messages = await selectById(id)
    if (messages.length === 0) {
        return NOT_FOUND_RES
    }

    messages = await Tags.addToMessages(messages, {
        pageIndex: 1,
        postsPerPage: DEFAULT_POSTS_PER_PAGE
    })

    return {
        success: true,
        message: messages[0]
    }
}