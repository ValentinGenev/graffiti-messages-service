import { database } from "..";
import { Post } from "../interface/IMessage";

export async function insertMessage(data: Post) {
    const result = await database.query(`
        INSERT
            INTO messages.entries (poster_id, poster, message)
            VALUES ('${data.poster_id}', '${data.name}', '${data.message}');`
    )
}