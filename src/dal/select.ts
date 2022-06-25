import dotenv from 'dotenv'
import { database } from "..";
import { Message } from "../interfaces/IMessage";
import { Pagination } from "../interfaces/IRequest";
import { Tag } from '../interfaces/ITag';

dotenv.config()

export function selectMessages(pagination: Pagination): Promise<Message[]> {
    const offset = pagination.pageIndex && pagination.postsPerPage ?
        (pagination.pageIndex - 1) * pagination.postsPerPage : 0

    return database.query(`
        SELECT *
            FROM ${process.env.DB_NAME}.messages
            ORDER BY id DESC
            LIMIT ?, ?`,
        [offset, pagination.postsPerPage]
    )
}

export function selectLatestMessageByPoster(posterId: string): Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${process.env.DB_NAME}.messages
            WHERE poster_id = ?
            ORDER BY post_date DESC
            LIMIT 1`,
        [posterId]
    )
}

export async function selectTagsByNames(names: string[]): Promise<Tag[]> {
    const values = names.map(name => `'${name}'`).join(',')

    return database.query(`
        SELECT *
            FROM ${process.env.DB_NAME}.tags
            WHERE name IN (${values})`
    )
}

export async function selectMessagesByTag(name: string): Promise<Message[]> {
    return database.query(`
        SELECT m.*
            FROM ${process.env.DB_NAME}.tags t
            JOIN ${process.env.DB_NAME}.messages_tags mt
            ON t.id = mt.tag_id
            INNER JOIN ${process.env.DB_NAME}.messages m
            ON m.id = mt.message_id
            WHERE t.name = ?`,
        [name]
    )
}

export async function selectTagsByMessage(id: number): Promise<Tag[]> {
    return database.query(`
        SELECT t.name
            FROM graffiti.tags t
            INNER JOIN graffiti.messages_tags mt
            ON t.id = mt.tag_id
            INNER JOIN graffiti.messages m
            ON m.id = mt.message_id
            WHERE m.id = ?`,
        [id]
    )
}

export async function countPosts(): Promise<number> {
    const data = await database.query(`
        SELECT COUNT(id)
            FROM ${process.env.DB_NAME}.messages`
    )

    return data.length ? data[0]['COUNT(id)'] : 0
}