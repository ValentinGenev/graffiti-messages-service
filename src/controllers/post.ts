import { Request, Response } from "express"
import { createMessage } from "../actions/create"
import { handleFailResponse } from "../utilities/responses"

export async function postMessage(request: Request, response: Response) {
    try {
        request.body.poster_id = request.header('Fingerprint')

        response.json(await createMessage(request.body))
    }
    catch (error) {
        handleFailResponse(error, response)
    }
}