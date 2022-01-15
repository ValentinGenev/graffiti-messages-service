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
    
    await insertMessage(data)

    return { success: true, message: data }
}

// TODO: maybe this should be handled by the client?
async function isSpam(posterId: string): Promise<boolean> {
    const lastPost = await selectMessage(posterId)

    if (lastPost.length === 1) {
        return posterIsSpamming(lastPost[0], Number(process.env.TIME_LIMIT))
    }

    return false
}