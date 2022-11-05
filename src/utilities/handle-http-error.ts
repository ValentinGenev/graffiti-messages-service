import { Response } from '../interfaces/IResponse'
import { CODES, STATUS_CODES, MESSAGES } from "./http-responses"
import { Logger } from "../lib/logger"

export function handleHttpError(error: any, response: Record<string, any>) {
    Logger.error(`${error.message} (${response.req.url})`)

    if (error?.response && 'data' in error.response) {
        response.status(error.response.status)
        response.json(error.response.data)
        return
    }

    response.status(STATUS_CODES[CODES.internalServerError])
    response.json({ code: CODES.internalServerError,
        message: MESSAGES.internalServerError })
}

export function getStatusCode(response: Response,
        code: string = CODES.ok): number {
    return response.error ? STATUS_CODES[response.error.code]
        : STATUS_CODES[code]
}
