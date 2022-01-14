import * as Dal from "../dal/insert"
import { Message, PostMessageResp } from "../interface/IMessage"
import { ERRORS } from "../utilities/constants"

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

    // TODO: check if the user is spammy

    await Dal.insertMessage(data)

    return { success: true, message: data }
}