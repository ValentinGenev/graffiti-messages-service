import { database } from "..";
import { Message } from "../interface/IMessage";
import { Pagination } from "../interface/IRequest";

export function selectMessages(pagination: Pagination): Promise<Message[]> {
    const offset = pagination.pageIndex && pagination.postsPerPage ?
        (pagination.pageIndex - 1) * pagination.postsPerPage : 0

    return database.query(`
        SELECT *
        FROM messages.entries
        ORDER BY id DESC
        LIMIT ?, ?`,
        [offset, pagination.postsPerPage]
    )
}

export function selectMessage(posterId: string): Promise<Message[]> {
    return database.query(`
        SELECT *
        FROM messages.entries
        WHERE poster_id = ?
        ORDER BY post_date DESC
        LIMIT 1`,
        [posterId]
    )
}

export async function countPosts(): Promise<number> {
    const data = await database.query(`
        SELECT COUNT(id)
        FROM messages.entries`
    )

    return data.length ? data[0]['COUNT(id)'] : 0
}