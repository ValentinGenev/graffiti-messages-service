import { GetMessageReq, GetMessagesReq, PostMessageReq } from "../interfaces/IMessage"
import * as Messages from "../services/messages"
import { Codes } from "../utilities/http-responses"
import { getStatus, handleInternalError } from "../utilities/responses"

export async function getMessages(request: GetMessagesReq, response: Record<string, any>) {
    try {
        const body = await Messages.getAll(request)

        response.status(getStatus(body, Codes.Ok))
        response.json(body)
    }
    catch (error) {
        handleInternalError(error, response)
    }
}

export async function getMessage(request: GetMessageReq, response: Record<string, any>) {
    try {
        const body = await Messages.getByPoster(request.params.poster_id)

        response.status(getStatus(body, Codes.Ok))
        response.json(body)
    }
    catch (error) {
        handleInternalError(error, response)
    }
}

export async function postMessage(request: PostMessageReq, response: Record<string, any>) {
    try {
        request.body.poster_id = request.header('Fingerprint')
        const body = await Messages.create(request.body)

        response.status(getStatus(body, Codes.Created))
        response.json(body)
    }
    catch (error) {
        handleInternalError(error, response)
    }
}