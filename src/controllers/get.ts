import { Request, Response } from "express"
import { readMessages, readMessageByPoster } from "../services/read"
import { GetMessagesReq } from "../interfaces/IMessage"
import { handleFailResponse } from "../utilities/responses"

export async function getMessages(request: Request, response: Response) {
    try {
        const requestBody: GetMessagesReq = {
            pageIndex: Number(request.params.pageIndex),
            postsPerPage: Number(request.query.postsPerPage)
        }

        // if (typeof request.query.tag === 'string') {
        //     requestBody.tag = request.query.tag
        // }

        // TODO: check if there are query params
        requestBody.filter = request.query

        response.json(await readMessages(requestBody))
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