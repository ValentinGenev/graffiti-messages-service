import { Response } from './IResponses'

export type Message = {
    poster_id: string
    name: string
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