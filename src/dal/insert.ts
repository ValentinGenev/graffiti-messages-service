import dotenv from 'dotenv'
import { database } from "..";
import { Message } from "../interfaces/IMessage";

dotenv.config()

export function insertMessage(data: Message): Promise<Record<string, any>> {
    return database.query(`
        INSERT
            INTO ${process.env.DB_NAME}.messages (poster_id, poster, message)
            VALUES ('${data.poster_id}', '${data.poster}', '${data.message}');`
    )
}

// TODO: insert the tags and relate them to the messages