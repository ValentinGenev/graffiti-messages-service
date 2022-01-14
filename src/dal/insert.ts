import { database } from "..";
import { Message } from "../interface/IMessage";

export async function insertMessage(data: Message) {
    const result = await database.query(`
        INSERT
            INTO messages.entries (poster_id, poster, message)
            VALUES ('${data.poster_id}', '${data.name}', '${data.message}');`
    )
}