import { readMessages, readMessage } from "../services/read"

export async function getMessages(_request: Record<string, any>, response: Record<string, any>): Promise<void> {
    try {
        response.json(await readMessages())
    }
    catch (error) {
        // TODO: figure a way to log errors
        console.log(error)
        response.json({ success: false })
    }  
}

export async function getMessage(request: Record<string, any>, response: Record<string, any>): Promise<void> {
    try {
        response.json(await readMessage(request.params.posterId))
    }
    catch (error) {
        // TODO: figure a way to log errors
        console.log(error)
        response.json({ success: false })
    }  
}