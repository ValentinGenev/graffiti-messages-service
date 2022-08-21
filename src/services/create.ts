import dotenv from 'dotenv'
import { insertMessage, insertTags, relateTagsAndMessages } from "../dal/insert"
import { selectLatestMessageByPoster, selectTagsByNames } from "../dal/select"
import { Message, PostMessageResp } from "../interfaces/IMessage"
import { posterIsSpamming, sanitizeHtml } from "../utilities/helper-functions"
import { Codes, MESSAGES } from "../utilities/http-responses"
import * as IRes from '../interfaces/IResponse'

dotenv.config()

export async function createMessage(data: Message): Promise<PostMessageResp> {
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
        await relateTagsToMessage(data.tags, messageInsert.insertId)
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

export async function relateTagsToMessage(tags: string[], messageId: number): Promise<IRes.Response> {
    if ((await handleTags(tags)).success) {
        await relateTagsAndMessages(messageId, tags)
    }

    return { success: true }
}

export async function handleTags(tags: string[]): Promise<IRes.Response> {
    const existingTags = (await selectTagsByNames(tags)).map(tag => tag.name)
    const newTags = tags.filter(tag => !existingTags.includes(tag))

    if (newTags.length) {
        await insertTags(newTags)
    }

    return { success: true }
}