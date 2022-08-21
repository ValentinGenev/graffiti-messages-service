import * as Dal from "../dal/select"
import { getPaginationData, parsePaginationData } from "./pagination";
import { GetMessageResp, GetMessagesReq, GetMessagesResp, Message } from "../interfaces/IMessage";
import { Codes, MESSAGES } from "../utilities/http-responses";

export async function readMessages(request: GetMessagesReq): Promise<GetMessagesResp> {
    const { query } = request;
    const pagination = parsePaginationData(query)
    let messages = query.tag ?
        await Dal.selectMessagesByTag(query.tag, pagination) :
        await Dal.selectMessages(pagination)

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: Codes.NotFound
            }
        }
    }

    messages = await addTags(messages)

    return {
        success: true,
        messages,
        pagination: await getPaginationData(pagination, query)
    }
}

// TODO: Rename it to match what it does
export async function readMessageByPoster(id: string): Promise<GetMessageResp> {
    if (!id) {
        return {
            success: false,
            error: {
                code: Codes.MissingData,
                message: MESSAGES.missingData('id')
            }
        }
    }

    const message = await Dal.selectLatestMessageByPoster(id)

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

async function addTags(messages: Message[]): Promise<Message[]> {
    const messagesWithTags = [...messages]

    for (const message of messagesWithTags) {
        if (message.id)
            message.tags = (await Dal.selectTagsByMessage(message.id)).map(tag => tag.name)
    }

    return messagesWithTags
}