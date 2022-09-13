import { Message } from '../interfaces/IMessage'
import { Link, Pagination, Links } from '../interfaces/IResponse'
import { Tag } from '../interfaces/ITag'

// TODO: add the postsPerPage to the query if given

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

export function addTags(tags: Tag[]): Link[] {
    return tags.map(createTagLink)
}

function createTagLink(tag: Tag): Link {
    const { name } = tag

    return {
        href: `/messages/?tag=${name}`,
        name: name
    }
}

export function addPaginationLinks(pagination: Pagination): Links {
    const links: Links = {}

    if (pagination.nextPageIndex) {
        links.next = {
            href: `/messages/?pageIndex=${pagination.nextPageIndex}`,
            name: 'Next page'
        }
    }
    if (pagination.previousPageIndex) {
        links.prev = {
            href: `/messages/?pageIndex=${pagination.previousPageIndex}`,
            name: 'Previous page'
        }
    }

    return links
}