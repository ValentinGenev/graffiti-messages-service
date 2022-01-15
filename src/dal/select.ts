import { database } from "..";
import { Message } from "../interface/IMessage";

export async function selectMessages(): Promise<Message[]> {
    return await database.query(`
        SELECT *
        FROM messages.entries
        ORDER BY id DESC`
    )
}

export async function selectMessage(posterId: string): Promise<Message[]> {
    return await database.query(`
        SELECT *
        FROM messages.entries
        WHERE poster_id = ?
        ORDER BY post_date DESC
        LIMIT 1`,
        [posterId]
    )
}