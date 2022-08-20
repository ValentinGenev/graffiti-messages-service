export type Error = {
    code: string,
    message?: string
}

export type Response = {
    success: boolean,
    error?: Error
}

export type Pagination = {
    pageIndex: number,
    postsCount: number,
    pagesCount: number,
    nextPageIndex?: number,
    previousPageIndex?: number
}