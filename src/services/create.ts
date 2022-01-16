import dotenv from 'dotenv'
import { insertMessage } from "../dal/insert"
import { selectMessage } from "../dal/select"
import { Message, PostMessageResp } from "../interface/IMessage"
import { posterIsSpamming } from "../utilities/helper-functions"
import { ERRORS } from "../utilities/constants"

dotenv.config()

export async function createMessage(data: Message): Promise<PostMessageResp> {
    if (!data.hasOwnProperty('message') || data.message === '') {
        return {
            success: false,
            error: {
                code: ERRORS.missingData,
                message: 'Missing data: message'
            }
        }
    }

    if (await isSpam(data.poster_id)) {
        return {
            success: false,
            error: {
                code: ERRORS.tooManyRequests,
                message: `You need to wait ${Number(process.env.TIME_LIMIT) / 60000} minutes before your next post`
            }
        }
    }

    data.message = sanitizeHtml(data.message)
    await insertMessage(data)

    return { success: true, message: data }
}

// TODO: maybe this should be handled by the client?
export async function isSpam(posterId: string): Promise<boolean> {
    const lastPost = await selectMessage(posterId)

    if (lastPost.length === 1) {
        return posterIsSpamming(lastPost[0], Number(process.env.TIME_LIMIT))
    }

    return false
}

export function sanitizeHtml(message: string): string {
    const badTags = ['link', 'style', 'iframe', 'script', 'svg']
    let result = message

    for (const tag of badTags) {
        const openingTag = new RegExp(`<${tag}[^>]*>`, 'ig')
        const closingTag = new RegExp(`<\/${tag}[^>]*>`, 'ig')

        result = result.replace(openingTag, '').replace(closingTag, '')
    }
    
    return result
}