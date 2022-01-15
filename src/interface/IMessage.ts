import { Response } from './IResponses'

export type Message = {
    post_date?: string
    poster_id: string
    poster: string
    message: string
}

export interface PostMessageResp extends Response {
    message?: Message
}

export interface GetMessagesResp extends Response {
    messages?: Message[]
}
export interface GetMessageResp extends Response {
    message?: Message
}