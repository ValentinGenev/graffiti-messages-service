import { insert, relateTagsAndMessages, selectAllByMessage, selectAllByNames } from '../dal/Tags'
import { Message } from '../interfaces/IMessage'
import { Pagination } from '../interfaces/IRequest'
import { Response } from '../interfaces/IResponse'
import * as Links from '../utilities/links'

export async function relateToMessage(tags: string[], messageId: number): Promise<Response> {
    if ((await handleTags(tags)).success) {
        await relateTagsAndMessages(messageId, tags)
    }

    return { success: true }
}

async function handleTags(tags: string[]): Promise<Response> {
    const existingTags = (await selectAllByNames(tags)).map(tag => tag.name)
    const newTags = tags.filter(tag => !existingTags.includes(tag))

    if (newTags.length) {
        await insert(newTags)
    }

    return { success: true }
}

export async function addToMessages(messages: Message[], pagination: Pagination):
        Promise<Message[]> {
    const messagesWithTags = [...messages]

    for (const message of messagesWithTags) {
        if (message.id) {
            const tags = await selectAllByMessage(message.id)
            if (tags.length) {
                message._embedded = { tags: Links.addTagsLinks(tags,
                    pagination.postsPerPage) }
            }
        }
    }

    return messagesWithTags
}