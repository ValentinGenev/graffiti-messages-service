import dotenv from 'dotenv'
import mysql from 'mysql'
import { database } from "..";
import { Message } from "../interfaces/IMessage";
import { selectTagsByNames } from './select';

dotenv.config()

const DB_NAME = process.env.DB_NAME

export function insertMessage(data: Message): Promise<mysql.OkPacket> {
    return database.query(`
        INSERT
            INTO ${DB_NAME}.messages (poster_id, message)
            VALUES (?, ?);`,
        [data.poster_id, data.message]
    )
}

export function insertTags(tags: string[]): Promise<mysql.OkPacket> {
    const values = tags.map(tag => `(${mysql.escape(tag)})`).join(',')

    return database.query(`
        INSERT
            INTO ${DB_NAME}.tags (name)
            VALUES ${values};`
    )
}

export async function relateTagsAndMessages(messageId: number, tagNames: string[]):
    Promise<mysql.OkPacket> {

    const tagIds = (await selectTagsByNames(tagNames)).map(tag => tag.id)
    const values = tagIds.map(tagId => (
        `(${mysql.escape(messageId)}, ${mysql.escape(tagId)})`
    )).join(',')

    return database.query(`
        INSERT
            INTO ${DB_NAME}.messages_tags (message_id, tag_id)
            VALUES ${values};`
    )
}