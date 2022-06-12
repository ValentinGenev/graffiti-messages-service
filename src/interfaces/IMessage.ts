import * as IReq from './IRequest'
import * as IRes from './IResponse'

export type Message = {
    id?: number,
    post_date?: string
    poster_id: string
    message: string
    tags?: string[]
}

export interface PostMessageResp extends IRes.Response {
    message?: Message
}

export interface GetMessagesReq extends IReq.Pagination { }
export interface GetMessagesResp extends IRes.Response {
    messages?: Message[]
    pagination?: IRes.Pagination
}
export interface GetMessageResp extends IRes.Response {
    message?: Message
}