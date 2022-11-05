import { GetMessageReq, GetMessagesReq, PostMessageReq } from '../interfaces/IMessage'
import { Response } from '../interfaces/IResponse'
import * as Messages from '../services/Messages'
import { isBlank } from '../utilities/helper-functions'
import { CODES } from '../utilities/http-responses'
import { getStatusCode, handleHttpError } from '../utilities/handle-http-error'
import { Logger } from '../lib/logger'

export async function getMessages(request: GetMessagesReq, response: Record<string, any>) {
    Logger.info('Call to: getMessages')

    try {
        const { query } = request
        let body: Response = {
            success: false,
            error: { code: CODES.internalServerError }
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

        throw new Error("test")

        response.status(getStatusCode(body, CODES.ok))
        response.json(body)
    }
    catch (error) {
        handleHttpError(error, response)
    }
}

export async function getMessage(request: GetMessageReq, response: Record<string, any>) {
    Logger.info('Call to: getMessage')

    try {
        const { params } = request
        const body = await Messages.getById(params.id)

        response.status(getStatusCode(body, CODES.ok))
        response.json(body)
    }
    catch (error) {
        handleHttpError(error, response)
    }
}

export async function postMessage(request: PostMessageReq, response: Record<string, any>) {
    Logger.info('Call to: postMessage')

    try {
        request.body.poster_id = request.header('Fingerprint')
        const body = await Messages.create(request.body)

        response.status(getStatusCode(body, CODES.created))
        response.json(body)
    }
    catch (error) {
        handleHttpError(error, response)
    }
}