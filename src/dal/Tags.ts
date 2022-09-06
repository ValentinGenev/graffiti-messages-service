import dotenv from 'dotenv'
import { database } from "..";
import { Tag } from '../interfaces/ITag';

dotenv.config()
const DB_NAME = process.env.DB_NAME

export function insert(tags: string[]): Promise<Record<string, any>> {
    const values = tags.map(tag => `(${database.escape(tag)})`).join(',')

    return database.query(`
        INSERT
            INTO ${DB_NAME}.tags (name)
            VALUES ${values};`
    )
}

export async function relateTagsAndMessages(messageId: number, tagNames: string[]):
    Promise<Record<string, any>> {

    const tagIds = (await selectAllByNames(tagNames)).map(tag => tag.id)
    const values = tagIds.map(tagId => (
        `(${messageId}, ${tagId})`
    )).join(',')

    return database.query(`
        INSERT
            INTO ${DB_NAME}.messages_tags (message_id, tag_id)
            VALUES ${values};`
    )
}

export async function selectAllByNames(names: string[]): Promise<Tag[]> {
    const values = names.map(name => database.escape(name)).join(',')

    return database.query(`
        SELECT *
            FROM ${DB_NAME}.tags
            WHERE name IN (${values})`
    )
}

export async function selectAllByMessage(id: number): Promise<Tag[]> {
    return database.query(`
        SELECT t.name
            FROM ${DB_NAME}.tags t
            INNER JOIN ${DB_NAME}.messages_tags mt
            ON t.id = mt.tag_id
            INNER JOIN ${DB_NAME}.messages m
            ON m.id = mt.message_id
            WHERE m.id = ?`,
        [id]
    )
}

export async function countMessagesWithTag(tag: string) : Promise<number> {
    const data = await database.query(`
        SELECT COUNT(m.id)
            FROM ${DB_NAME}.tags t
            JOIN ${DB_NAME}.messages_tags mt
            ON t.id = mt.tag_id
            INNER JOIN ${DB_NAME}.messages m
            ON m.id = mt.message_id
            WHERE t.name = ?`,
        [tag]
    )

    return data[0]['COUNT(m.id)']
}