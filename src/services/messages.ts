import dotenv from 'dotenv'
import { selectMessages, selectMessagesByTag } from "../dal/select"
import { insertMessage } from '../dal/insert'
import { selectLatestMessageByPoster } from '../dal/select'
import { GetMessageResp, GetMessagesReq, GetMessagesResp, Message, PostMessageResp } from '../interfaces/IMessage'
import { posterIsSpamming, sanitizeHtml } from '../utilities/helper-functions'
import { Codes, MESSAGES } from '../utilities/http-responses'
import { getPaginationData, parsePaginationData } from "./pagination";
import * as Tags from './tags'

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

export async function getAll(request: GetMessagesReq): Promise<GetMessagesResp> {
    const { query } = request;
    const pagination = parsePaginationData(query)
    let messages = query.tag ?
        await selectMessagesByTag(query.tag, pagination) :
        await selectMessages(pagination)

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
        pagination: await getPaginationData(pagination, query)
    }
}

export async function getByPoster(id: string): Promise<GetMessageResp> {
    if (!id) {
        return {
            success: false,
            error: {
                code: Codes.MissingData,
                message: MESSAGES.missingData('id')
            }
        }
    }

    const message = await selectLatestMessageByPoster(id)

    if (message.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    return { success: true, message: message[0] }
}
