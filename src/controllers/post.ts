import { createMessage } from "../services/create"

export async function postMessage(request: Record<string, any>, response: Record<string, any>): Promise<void> {
    try {
        request.body.poster_id = request.fingerprint.hash

        response.json(await createMessage(request.body))
    }
    catch (error) {
        // TODO: set different response codes
        // TODO: figure a way to log errors
        console.error(error)
        response.json({ success: false })
    }    
}