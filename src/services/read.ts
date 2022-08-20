import * as Dal from "../dal/select"
import { getPaginationData, parsePaginationData } from "./pagination";
import { GetMessageResp, GetMessagesResp, Message } from "../interfaces/IMessage";
import { ERRORS } from "../utilities/constants";

export async function readMessages(request: Record<string, any>): Promise<GetMessagesResp> {
    const { query } = request;
    const pagination = parsePaginationData(query)
    let messages = query.tag ?
        await Dal.selectMessagesByTag(query.tag, pagination) :
        await Dal.selectMessages(pagination)

    if (messages.length === 0) {
        return {
            success: false,
            error: {
                code: ERRORS.notFound
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
                code: ERRORS.missingData,
                message: 'Missing data: id'
            }
        }
    }

    const message = await Dal.selectLatestMessageByPoster(id)

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

async function addTags(messages: Message[]): Promise<Message[]> {
    const messagesWithTags = [...messages]

    for (const message of messagesWithTags) {
        if (message.id)
            message.tags = (await Dal.selectTagsByMessage(message.id)).map(tag => tag.name)
    }

    return messagesWithTags
}