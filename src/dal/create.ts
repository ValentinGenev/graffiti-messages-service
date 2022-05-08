import { MySqlDatabase } from "../lib/database"


export async function createTables(database: MySqlDatabase): Promise<void> {
    await createMessagesTable(database)
    await createTagsTable(database)
    await createMessagesTagsTable(database)
}

async function createMessagesTable(database: MySqlDatabase): Promise<void> {
    database.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            poster_id VARCHAR(256),
            message TEXT
        );`
    )
}

async function createTagsTable(database: MySqlDatabase): Promise<void> {
    database.query(`
        CREATE TABLE IF NOT EXISTS tags (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            tag VARCHAR(256)
        );`
    )
}

async function createMessagesTagsTable(database: MySqlDatabase): Promise<void> {
    database.query(`
        CREATE TABLE IF NOT EXISTS messages_tags (
            message_id INT(6) UNSIGNED,
            tag_id INT(6) UNSIGNED,
            CONSTRAINT const_message_tags_fk
                FOREIGN KEY message_fk (message_id) REFERENCES messages (id)
                ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT constr_tag_messages_fk
                FOREIGN KEY tag_fk (tag_id) REFERENCES tags (id)
                ON DELETE CASCADE ON UPDATE CASCADE
        );`
    )
}