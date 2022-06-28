import { Response } from "express"

export function handleFailResponse(error: any, response: Response) {
    // TODO: figure a way to log errors
    console.log(error)
    response.json({ success: false })
}