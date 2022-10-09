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

export function addPaginationLinks(pagination: Pagination, query: Record<string, any>): Links {
    const links: Links = {}
    query.postsPerPage = pagination.postsPerPage

    if (pagination.nextPageIndex) {
        query.pageIndex = pagination.nextPageIndex
        links.next = {
            href: `/messages/?${createQueryString(query)}`,
            name: 'Next page'
        }
    }
    if (pagination.previousPageIndex) {
        query.pageIndex = pagination.previousPageIndex
        links.prev = {
            href: `/messages/?${createQueryString(query)}`,
            name: 'Previous page'
        }
    }

    return links
}

function createQueryString(query: Record<string, any>): string {
    const queryStrings = []

    for (const key in query) {
        queryStrings.push(`${key}=${query[key]}`);
    }
    return queryStrings.join('&')
}