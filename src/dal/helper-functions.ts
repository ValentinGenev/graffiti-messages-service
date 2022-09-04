import { Pagination } from "../interfaces/IRequest";

export function getOffset(pagination: Pagination) {
    return pagination.pageIndex && pagination.postsPerPage ?
        (pagination.pageIndex - 1) * pagination.postsPerPage : 0
}