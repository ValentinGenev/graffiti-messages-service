import { MySqlDatabase } from "../lib/database"

// TODO: investigate deeper if this is going to cause sync issues
export async function syncZoneWithNode(database: MySqlDatabase): Promise<void> {
    const offset = Math.abs(new Date().getTimezoneOffset() / 60)
    await database.
        query(`SET time_zone = '+${offset < 10 ? '0' + offset : offset}:00';`)
}