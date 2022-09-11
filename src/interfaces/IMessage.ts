import { Filter } from './IRequest'
import { Response, Pagination } from './IResponse'

export type Message = {
    id?: number,
    post_date?: string,
    poster_id: string,
    message: string,
    tags?: string[]
}

export interface GetMessagesReq {
    query: Filter
}
export interface GetMessagesResp extends Response {
    messages?: Message[],
    pagination?: Pagination
}

export interface GetMessageReq {
    params: {
        id: number
    }
}
export interface GetMessageResp extends Response {
    message?: Message;
}

export interface PostMessageReq {
    body: Message,
    header: (arg0: string) => any
}
export interface PostMessageResp extends Response {
    message?: Message
}