import { Message } from '../interfaces/IMessage'
import { Link, Links } from '../interfaces/IResponse'
import { Tag } from '../interfaces/ITag'

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