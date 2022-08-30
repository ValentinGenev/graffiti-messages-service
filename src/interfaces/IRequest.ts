export type Pagination = {
    pageIndex: number,
    postsPerPage: number
}

export interface Filter extends Pagination {
    tag?: string,
    posterId?: string,
}