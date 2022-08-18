import { Request, Response } from "express"
import {
    readMessages,
    readMessageByPoster
} from "../services/read"
import { GetMessagesReq } from "../interfaces/IMessage"
import { handleFailResponse } from "../utilities/responses"

export async function getMessages(request: Request, response: Response) {
    try {
        const messageRequest: GetMessagesReq = {
            pageIndex: Number(request.params.pageIndex),
            postsPerPage: Number(request.query.postsPerPage)
        }

        if (typeof request.query.tag === 'string') {
            messageRequest.tag = request.query.tag
        }

        response.json(await readMessages(messageRequest))
    }
    catch (error) {
        handleFailResponse(error, response)
    }
}

export async function getMessage(request: Request, response: Response) {
    try {
        response.json(await readMessageByPoster(request.params.posterId))
    }
    catch (error) {
        handleFailResponse(error, response)
    }
}