import dotenv from 'dotenv'
import mysql from 'mysql'
import { database } from "..";
import { Message } from "../interfaces/IMessage";
import { Pagination } from "../interfaces/IRequest";
import { Tag } from '../interfaces/ITag';

dotenv.config()

const DB_NAME = process.env.DB_NAME

export function selectMessages(pagination: Pagination): Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${DB_NAME}.messages
            ORDER BY id DESC
            LIMIT ?, ?`,
        [getOffset(pagination), pagination.postsPerPage]
    )
}

export function selectLatestMessageByPoster(posterId: string): Promise<Message[]> {
    return database.query(`
        SELECT *
            FROM ${DB_NAME}.messages
            WHERE poster_id = ?
            ORDER BY post_date DESC
            LIMIT 1`,
        [posterId]
    )
}

export async function selectTagsByNames(names: string[]): Promise<Tag[]> {
    const values = names.map(name => mysql.escape(name)).join(',')

    return database.query(`
        SELECT *
            FROM ${DB_NAME}.tags
            WHERE name IN (${values})`
    )
}

export async function selectMessagesByTag(name: string, pagination: Pagination): Promise<Message[]> {
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

export async function selectTagsByMessage(id: number): Promise<Tag[]> {
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

export async function countPosts(): Promise<number> {
    const data = await database.query(`
        SELECT COUNT(id)
            FROM ${DB_NAME}.messages`
    )

    return data.length ? data[0]['COUNT(id)'] : 0
}

export async function countPostsWithTag(tag: string) : Promise<number> {
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

    return data.length ? data[0]['COUNT(m.id)'] : 0
}

function getOffset(pagination: Pagination) {
    return pagination.pageIndex && pagination.postsPerPage ?
        (pagination.pageIndex - 1) * pagination.postsPerPage : 0
}