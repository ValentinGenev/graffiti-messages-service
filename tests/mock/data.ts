import { Message } from "../../src/interfaces/IMessage"
import { Filter } from "../../src/interfaces/IRequest"
import { Response, Pagination } from "../../src/interfaces/IResponse"
import { Tag } from "../../src/interfaces/ITag"
import { Codes, MESSAGES } from "../../src/utilities/http-responses"

export const posterId = 'randomfingerprintstring_test_read'
export const messageId = 1
export const tagNames = ['Tag Name 0', 'Tag Name 1', "' or 1=1; drop table graffiti.messages; —"]
export const tagNamesForMessages = ['MTag Label 0', 'MTag Label 1']

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
    id: messageId,
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
    ...message,
    tags: tagNames,
    _embedded: {
        tags: [
            {
                href: `/messages/?tag=${tagNames[0]}`,
                name: tagNames[0]
            },
            {
                href: `/messages/?tag=${tagNames[1]}`,
                name: tagNames[1]
            },
            {
                href: `/messages/?tag=${tagNames[2]}`,
                name: tagNames[2]
            }
        ]
    },
}
export const messageWithLinks: Message = {
    ...messageWithTags,
    _links: {
        self: {
            href: `/messages/${messageId}`
        }
    }
}

export const tag: Tag = {
    id: 1,
    name: tagNames[0]
}

export const paginationFilter: Filter = {
    pageIndex: 1,
    postsPerPage: 10
}
export const secondPageFilter: Filter = {
    pageIndex: 2,
    postsPerPage: 10
}
export const posterFilter: Filter = {
    ...paginationFilter,
    posterId,
}
export const tagFilter: Filter = {
    ...paginationFilter,
    tag: tagNames[0]
}
export const filterWithoutPagination = {
    tag: tagNames[0]
}

export const pagination: Pagination = {
    pageIndex: 1,
    postsPerPage: 5,
    postsCount: 1,
    pagesCount: 1
}
export const paginationWithNext: Pagination = {
    ...pagination,
    nextPageIndex: 2
}
export const paginationWithPrevious: Pagination = {
    ...pagination,
    previousPageIndex: 1
}

export const successResponse: Response = {
    success: true,
}
export const failureResponse: Response = {
    success: false,
    error: {
        code: Codes.InternalServerError,
        message: MESSAGES.internalServerError
    }
}