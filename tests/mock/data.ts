import { Message } from "../../src/interfaces/IMessage"
import { Filter } from "../../src/interfaces/IRequest"
import { Pagination } from "../../src/interfaces/IResponse"

export const posterId = 'randomfingerprintstring_test_read'
export const tagNames = ['Read Label 0', 'Read Label 1', "' or 1=1; drop table graffiti.messages; —"]
export const oldMessage: Message = {
    post_date: '2022-04-20 00:00:00',
    poster_id: posterId,
    message: 'Hello, Old World!'
}
export const spamMessage: Message = {
    post_date: '4044-04-20 00:00:00',
    poster_id: posterId,
    message: 'Hello, World!'
}
export const message: Message = {
    poster_id: posterId,
    message: 'Hello, World!'
}
export const messageWithEmptyMessage: Message = {
    poster_id: posterId,
    message: '',
}
export const messageHugeMessage: Message = {
    poster_id: posterId,
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor ante dapibus nulla vestibulum convallis. Aenean posuere odio quis mattis blandit. Vivamus semper dolor sed nulla blandit pellentesque. In interdum ac mauris aliquet ornare. Donec sit amet porta lacus. Sed aliquam erat ac lacus pellentesque faucibus. Etiam leo arcu, dignissim a mattis eu, scelerisque a est. Donec iaculis at enim quis tempus. Integer ut imperdiet elit. Etiam congue lobortis interdum. Aliquam sed faucibus est. Morbi ante metus.',
}
export const messageWithTags: Message = {
    poster_id: posterId,
    message: 'Hello, World!',
    tags: tagNames
}

export const paginationFilter: Filter = {
    pageIndex: 1,
    postsPerPage: 10
}
export const posterFilter: Filter = {
    posterId,
    pageIndex: 1,
    postsPerPage: 10
}
export const tagFilter: Filter = {
    tag: tagNames[0],
    pageIndex: 1,
    postsPerPage: 10
}
export const pagination: Pagination = {
    pageIndex: 1,
    postsCount: 1,
    pagesCount: 1
}