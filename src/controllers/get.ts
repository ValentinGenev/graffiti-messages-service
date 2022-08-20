import { readMessages, readMessageByPoster } from "../services/read"
import { handleFailResponse } from "../utilities/responses"
import { Response } from "express"

export async function getMessages(request: Record<string, any>, response: Response<any, Record<string, any>>) {
    try {
        response.json(await readMessages(request))
    }
    catch (error) {
        handleFailResponse(error, response)
    }
}

export async function getMessage(request: { params: { posterId: string } }, response: Response<any, Record<string, any>>) {
    try {
        response.json(await readMessageByPoster(request.params.posterId))
    }
    catch (error) {
        handleFailResponse(error, response)
    }
}