import { Message } from '../interfaces/IMessage'
import { Link, Pagination, Links } from '../interfaces/IResponse'
import { Tag } from '../interfaces/ITag'
import { DEFAULT_POSTS_PER_PAGE } from './pagination'

export function addSelfLink(messages: Message[]): Message[] {
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

export function addTagsLinks(tags: Tag[],
        postsPerPage: number = DEFAULT_POSTS_PER_PAGE): Link[] {
    return tags.map(tag => {
        const { name } = tag

        return {
            href: `/messages/?tag=${name}&postsPerPage=${postsPerPage}`,
            name
        }
    })
}

export function addPaginationLinks(pagination: Pagination): Links {
    const links: Links = {}

    if (pagination.nextPageIndex) {
        links.next = {
            href: `/messages/?pageIndex=${pagination.nextPageIndex}&postsPerPage=${pagination.postsPerPage}`,
            name: 'Next page'
        }
    }
    if (pagination.previousPageIndex) {
        links.prev = {
            href: `/messages/?pageIndex=${pagination.previousPageIndex}&postsPerPage=${pagination.postsPerPage}`,
            name: 'Previous page'
        }
    }

    return links
}