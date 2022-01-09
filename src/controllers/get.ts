import { readMessages } from "../services/read"

export async function getMessages(request: Record<string, any>, response: Record<string, any>): Promise<void> {
    try {
        // TODO: add pagination
        const result = await readMessages()

        response.json({ success: true, data: result })
    }
    catch (error) {
        // TODO: figure a way to log errors
        console.log(error)
        response.json({ success: false })
    }  
}