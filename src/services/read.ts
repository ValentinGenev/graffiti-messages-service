import * as Dal from "../dal/select"
import { GetMessageResp, GetMessagesResp } from "../interface/IMessage";
import { ERRORS } from "../utilities/constants";

export async function readMessages(): Promise<GetMessagesResp> {
    // TODO: add pagination    

    const messages = await Dal.selectMessages()

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: ERRORS.notFound
            }
        }
    }

    return { success: true, messages }
}

export async function readMessage(posterId: string): Promise<GetMessageResp> {
    if (posterId === '') {
        return {
            success: false,
            error: {
                code: ERRORS.missingData,
                message: 'Missing data: posterId'
            }
        }
    }

    const message = await Dal.selectMessage(posterId)

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