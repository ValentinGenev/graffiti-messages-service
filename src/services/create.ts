import * as Dal from "../dal"
import { Post } from "../interface/IMessage"

export async function createMessage(data: Post): Promise<void> {
    // TODO: add validation here

    await Dal.insertMessage(data)
}