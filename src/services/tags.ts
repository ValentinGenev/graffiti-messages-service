import { insertTags, relateTagsAndMessages } from "../dal/insert"
import { selectTagsByMessage, selectTagsByNames } from "../dal/select"
import { Message } from "../interfaces/IMessage"
import { Response } from '../interfaces/IResponse'

export async function relateToMessage(tags: string[], messageId: number): Promise<Response> {
    if ((await handleTags(tags)).success) {
        await relateTagsAndMessages(messageId, tags)
    }

    return { success: true }
}

async function handleTags(tags: string[]): Promise<Response> {
    const existingTags = (await selectTagsByNames(tags)).map(tag => tag.name)
    const newTags = tags.filter(tag => !existingTags.includes(tag))

    if (newTags.length) {
        await insertTags(newTags)
    }

    return { success: true }
}

export async function add(messages: Message[]): Promise<Message[]> {
    const messagesWithTags = [...messages]

    for (const message of messagesWithTags) {
        if (message.id)
            message.tags = (await selectTagsByMessage(message.id)).map(tag => tag.name)
    }

    return messagesWithTags
}