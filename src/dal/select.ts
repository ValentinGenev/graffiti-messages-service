import { database } from "..";
import { Post } from "../interface/IMessage";

export async function selectMessages(): Promise<Post[]> {
    return await database.query(`
        SELECT *
        FROM messages.entries`
    )
}