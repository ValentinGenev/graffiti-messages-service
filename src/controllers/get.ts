import { readMessages, readMessage } from "../actions/read"

export async function getMessages(request: Record<string, any>, response: Record<string, any>): Promise<void> {
    try {
        response.json(await readMessages({
            pageIndex: request.params.pageIndex,
            postsPerPage: request.query.postsPerPage
        }))
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