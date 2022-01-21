import { database } from "..";
import { Message } from "../interface/IMessage";

export function insertMessage(data: Message): Promise<Record<string, any>> {
    return database.query(`
        INSERT
            INTO messages.entries (poster_id, poster, message)
            VALUES ('${data.poster_id}', '${data.poster}', '${data.message}');`
    )
}