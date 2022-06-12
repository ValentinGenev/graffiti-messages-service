import dotenv from 'dotenv'
import { database } from "..";
import { Message } from "../interfaces/IMessage";
import { selectTagsByName } from './select';

dotenv.config()

export function insertMessage(data: Message): Promise<Record<string, any>> {
    return database.query(`
        INSERT
            INTO ${process.env.DB_NAME}.messages (poster_id, message)
            VALUES ('${data.poster_id}', '${data.message}');`
    )
}

export function insertTags(tags: string[]) {
    const values = tags.map(tag => `('${tag}')`).join(',')

    return database.query(`
        INSERT
            INTO ${process.env.DB_NAME}.tags (name)
            VALUES ${values};`
    )
}

export async function relateTagsAndMessages(messageId: number, tagNames: string[]):
    Promise<Record<string, any>> {

    const tagIds = (await selectTagsByName(tagNames)).map(tag => tag.id)
    const values = tagIds.map(tagId => `(${messageId}, ${tagId})`).join(',')

    return database.query(`
        INSERT
            INTO ${process.env.DB_NAME}.messages_tags (message_id, tag_id)
            VALUES ${values};`
    )
}