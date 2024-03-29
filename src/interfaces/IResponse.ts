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
    postsPerPage: number,
    postsCount: number,
    pagesCount: number,
    nextPageIndex?: number,
    previousPageIndex?: number,
    _links?: Links
}

export type Links = {
    self?: Link,
    next?: Link,
    prev?: Link,
}
export type Link = {
    href: string,
    name?: string
}