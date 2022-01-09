import * as Dal from "../dal"
import { Post } from "../interface/IMessage";

export async function readMessages(): Promise<Post[]> {
    // TODO: add validation
    
    return await Dal.selectMessages()
}