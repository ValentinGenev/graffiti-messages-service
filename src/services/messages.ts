import dotenv from 'dotenv'
import { selectAllByPoster, selectMessages, selectMessagesByTag } from "../dal/select"
import { insertMessage } from '../dal/insert'
import { selectLatestMessageByPoster } from '../dal/select'
import { Message, PostMessageResp, GetMessagesResp } from '../interfaces/IMessage'
import { posterIsSpamming, sanitizeHtml } from '../utilities/helper-functions'
import { Codes, MESSAGES } from '../utilities/http-responses'
import { getPaginationData, parsePaginationData } from "./pagination";
import * as Tags from './tags'
import { Filter } from '../interfaces/IRequest'

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

    if (await isSpam(data.poster_id)) {
        return {
            success: false,
            error: {
                code: Codes.TooManyRequests,
                message: MESSAGES.tooManyRequests(Number(process.env.TIME_LIMIT) / 60000)
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

    data.message = sanitizeHtml(data.message)
    const messageInsert = await insertMessage(data)

    if (data.tags?.length) {
        await Tags.relateToMessage(data.tags, messageInsert.insertId)
    }

    return { success: true, message: data }
}

export async function isSpam(posterId: string): Promise<boolean> {
    const lastPost = await selectLatestMessageByPoster(posterId)

    if (lastPost.length === 1) {
        return posterIsSpamming(lastPost[0], Number(process.env.TIME_LIMIT))
    }

    return false
}

export async function getAllByTag(filter: Filter): Promise<GetMessagesResp> {
    const pagination = parsePaginationData(filter);
    let messages: Message[] = []

    if (filter.tag) {
        messages = await selectMessagesByTag(filter.tag, pagination)
    }

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    messages = await Tags.add(messages)

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

    messages = await Tags.add(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, filter)
    }

}

export async function getAll(filter: Filter): Promise<GetMessagesResp> {
    const pagination = parsePaginationData(filter)
    let messages = await selectMessages(pagination)

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    messages = await Tags.add(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, filter)
    }
}
