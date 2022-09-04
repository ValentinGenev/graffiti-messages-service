import { GetMessagesReq, PostMessageReq } from '../interfaces/IMessage'
import { Response } from '../interfaces/IResponse'
import * as Messages from '../services/Messages'
import { isBlank } from '../utilities/helper-functions'
import { Codes } from '../utilities/http-responses'
import { getStatus, handleInternalError } from '../utilities/responses'

export async function getMessages(request: GetMessagesReq, response: Record<string, any>) {
    try {
        const { query } = request
        let body: Response = {
            success: false,
            error: { code: Codes.InternalServerError }
        }

        if (!isBlank(query.tag) && !isBlank(query.posterId)) {
            // TODO: roll the biggest rock
        }
        else if (!isBlank(query.tag)) {
            body = await Messages.getAllByTag(query)
        }
        else if (!isBlank(query.posterId)) {
            body = await Messages.getAllByPosterId(query)
        }
        else {
            body = await Messages.getAll(query)
        }

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