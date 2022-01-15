import { Message } from "../interface/IMessage";

/**
 * @param timeLimit default is 2 minutes in ms
 */
export function posterIsSpamming(lastPost: Message, timeLimit: number = 120000): boolean {
    const postTime = new Date(lastPost.post_date ? lastPost.post_date : '').getTime()
    const currentTime = Date.now()

    return currentTime - postTime < timeLimit
}

/**
 * @returns 2022-01-01T00:00:00.000Z
 */
export function convertUnixToDbTime(unix: number): string {
    return new Date(unix).toISOString()
}