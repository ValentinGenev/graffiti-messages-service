import { Response } from "express"

export function handleFailResponse(error: any, response: Response) {
    // TODO: figure a way to log errors
    // TODO: get the HTTP status and code from the response

    console.log(error)
    response.json({ success: false })
}