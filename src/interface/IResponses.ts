export type Error = {
    code: string
    message?: string
}

export type Response = {
    success: boolean
    error?: Error
}