import { Response } from '../interfaces/IResponse'
import { STATUSES, Codes, MESSAGES } from './http-responses'

export function getStatus(response: Response, code: Codes = Codes.Ok): number {
    return response.error ? STATUSES[response.error.code] : STATUSES[code]
}

export function handleInternalError(error: any, response: Record<string, any>) {
    storeErrorInLog(error)

    const body: Response = {
        success: false,
        error: {
            code: Codes.InternalServerError,
            message: MESSAGES.internalServerError
        }
    }

    response.status(STATUSES[Codes.InternalServerError])
    response.json(body)
}

function storeErrorInLog(error: any) {
    // TODO: store the actual error in an error log
    console.log(`${utcDate()} [ERROR]`, error)
}

function utcDate(): string {
    const time = new Date()
    return time.toLocaleString()
}