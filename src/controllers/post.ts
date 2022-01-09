import { createMessage } from "../services/create"

export async function postMessage(request: Record<string, any>, response: Record<string, any>): Promise<void> {
    try {
        await createMessage(request.body)

        response.json({ success: true })
    }
    catch (error) {
        // TODO: figure a way to log errors
        console.log(error)
        response.json({ success: false })
    }    
}