import { Message } from '../interfaces/IMessage'
import { Link, Pagination, Links } from '../interfaces/IResponse'
import { Tag } from '../interfaces/ITag'
import { DEFAULT_POSTS_PER_PAGE } from './pagination'

export function addSelf(messages: Message[]): Message[] {
    return messages.map(createSelfLink)
}

function createSelfLink(message: Message): Message {
    message._links = {
        self: {
            href: `/messages/${message.id}`
        }
    }

    return message
}

export function addTags(tags: Tag[],
        postsPerPage: number = DEFAULT_POSTS_PER_PAGE): Link[] {
    return tags.map(tag => {
        const { name } = tag

        return {
            href: `/messages/?tag=${name}&postsPerPage=${postsPerPage}`,
            name
        }
    })
}

export function addPaginationLinks(pagination: Pagination,
        postsPerPage: number): Links {
    const links: Links = {}

    if (pagination.nextPageIndex) {
        links.next = {
            href: `/messages/?pageIndex=${pagination.nextPageIndex}&postsPerPage=${postsPerPage}`,
            name: 'Next page'
        }
    }
    if (pagination.previousPageIndex) {
        links.prev = {
            href: `/messages/?pageIndex=${pagination.previousPageIndex}&postsPerPage=${postsPerPage}`,
            name: 'Previous page'
        }
    }

    return links
}