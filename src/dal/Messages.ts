import dotenv from 'dotenv'
import { database } from "..";
import { Message } from "../interfaces/IMessage";
import { Pagination } from "../interfaces/IRequest";
import { getOffset } from './helper-functions';

dotenv.config()
const DB_NAME = process.env.DB_NAME

export function insert(data: Message): Promise<Record<string, any>> {
    return database.query(`
        INSERT
            INTO ${DB_NAME}.messages (poster_id, message)
            VALUES (?, ?);`,
        [data.poster_id, data.message]
    )
}

export function selectAll(pagination: Pagination): Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${DB_NAME}.messages
            ORDER BY id DESC
            LIMIT ?, ?`,
        [getOffset(pagination), pagination.postsPerPage]
    )
}

export async function selectAllByPoster(posterId: string, pagination: Pagination)
        : Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${DB_NAME}.messages
            WHERE poster_id = ?
            ORDER BY post_date DESC
            LIMIT ?, ?`,
        [posterId, getOffset(pagination), pagination.postsPerPage]
    )
}

export function selectLastByPoster(posterId: string): Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${DB_NAME}.messages
            WHERE poster_id = ?
            ORDER BY post_date DESC
            LIMIT 1`,
        [posterId]
    )
}

export async function selectAllWithTag(name: string, pagination: Pagination):
        Promise<Message[]> {
    return database.query(`
        SELECT m.*
            FROM ${DB_NAME}.tags t
            JOIN ${DB_NAME}.messages_tags mt
            ON t.id = mt.tag_id
            INNER JOIN ${DB_NAME}.messages m
            ON m.id = mt.message_id
            WHERE t.name = ?
            ORDER BY id DESC
            LIMIT ?, ?`,
        [name, getOffset(pagination), pagination.postsPerPage]
    )
}

export async function selectById(id: number): Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${DB_NAME}.messages
            WHERE id = ?
            LIMIT 1`,
        [id]
    )
}

export async function count(): Promise<number> {
    const data = await database.query(`
        SELECT COUNT(id)
            FROM ${DB_NAME}.messages`
    )

    return data[0]['COUNT(id)']
}

export async function countByPoster(posterId: string): Promise<number> {
    const data = await database.query(`
        SELECT COUNT(m.id)
            FROM ${DB_NAME}.messages m
            WHERE m.poster_id = ?`,
        [posterId]
    )

    return data[0]['COUNT(m.id)']
}
