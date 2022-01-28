import path from 'path'

export function documentation(request: Record<string, any>, response: Record<string, any>): void {
    try {
        response.sendFile(path.join(__dirname, '../../public/documentation.html'))
    }
    catch (error) {
        // TODO: set different response codes
        // TODO: figure a way to log errors
        console.error(error)
        response.json({ success: false })
    } 
}