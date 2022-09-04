import bodyParser from 'body-parser';
import { Message } from '../interfaces/IMessage';
import { RestServer } from '../lib/rest';

/**
 * @param timeLimit default is 2 minutes in ms
 */
export function posterIsSpamming(lastPost: Message, timeLimit: number = 120000): boolean {
    const postTime = new Date(lastPost.post_date ? lastPost.post_date : '').getTime()
    const currentTime = Date.now()

    return currentTime - postTime < timeLimit
}

export function sanitizeHtml(message: string): string {
    const badTags = ['link', 'style', 'iframe', 'script', 'svg']
    let result = message

    for (const tag of badTags) {
        const openingTag = new RegExp(`<${tag}[^>]*>`, 'ig')
        const closingTag = new RegExp(`<\/${tag}[^>]*>`, 'ig')

        result = result.replace(openingTag, '').replace(closingTag, '')
    }

    return result
}

/**
 * @returns 2022-01-01T00:00:00.000Z
 */
export function convertUnixToDbTime(unix: number): string {
    return new Date(unix).toISOString()
}

export function useBodyParser(rest: RestServer): void {
    rest.getServer().use(bodyParser.json())
}

export function isBlank(target: string | null | undefined) {
    return !target && target?.toString().trim() !== ''
}