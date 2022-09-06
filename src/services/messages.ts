import dotenv from 'dotenv'
import { insert, selectAll, selectAllByPoster, selectLastByPoster, selectAllWithTag } from '../dal/Messages'
import { Message, PostMessageResp, GetMessagesResp } from '../interfaces/IMessage'
import { Filter } from '../interfaces/IRequest'
import { posterIsSpamming, sanitizeHtml } from '../utilities/helper-functions'
import { Codes, MESSAGES } from '../utilities/http-responses'
import { getPaginationData, parsePaginationData } from "./pagination";
import * as Tags from './Tags'

dotenv.config()

export async function create(data: Message): Promise<PostMessageResp> {
    if (!data.hasOwnProperty('message') || data.message === '') {
        return {
            success: false,
            error: {
                code: Codes.MissingData,
                message: MESSAGES.missingData('message')
            }
        }
    }

    if (data.message.length > Number(process.env.MAX_MESSAGE_LENGTH)) {
        return {
            success: false,
            error: {
                code: Codes.MaxLengthExceeded,
                message: MESSAGES.maxLengthExceeded
            }
        }
    }

    if (await isSpam(data.poster_id)) {
        return {
            success: false,
            error: {
                code: Codes.TooManyRequests,
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
    const pagination = parsePaginationData(filter)
    let messages = await selectAll(pagination)

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    messages = await Tags.addToMessages(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, filter)
    }
}

export async function getAllByPosterId(filter: Filter): Promise<GetMessagesResp> {
    const pagination = parsePaginationData(filter);
    let messages: Message[] = []

    if (filter.posterId) {
        messages = await selectAllByPoster(filter.posterId, pagination)
    }

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    messages = await Tags.addToMessages(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, filter)
    }

}

export async function getAllByTag(filter: Filter): Promise<GetMessagesResp> {
    const pagination = parsePaginationData(filter);
    let messages: Message[] = []

    if (filter.tag) {
        messages = await selectAllWithTag(filter.tag, pagination)
    }

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    messages = await Tags.addToMessages(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, filter)
    }
}