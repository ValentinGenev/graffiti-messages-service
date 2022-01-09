export function healthCheck(_request: Record<string, any>, response: Record<string, any>): void {
    response.json({ status: 'online' })
}