export const posterId = 'randomfingerprintstring_test_read'
export const tagNames = ['Read Label 0', 'Read Label 1', "' or 1=1; drop table graffiti.messages; —"]
export const oldMessageData = {
    post_date: '2022-04-20 00:00:00',
    poster_id: posterId,
    message: 'Hello, Old World!'
}
export const messageData = {
    post_date: '2022-04-20 00:00:10',
    poster_id: posterId,
    message: 'Hello, World!'
}
export const messageDataWithTags = {
    poster_id: posterId,
    message: 'Hello, World!',
    tags: tagNames
}
export const messageDataWithoutMessage = {
    poster_id: posterId,
    tags: tagNames
}
export const messageDataWithEmptyMessage = {
    poster_id: posterId,
    message: '',
    tags: tagNames
}

export const filter = {
    pageIndex: 1,
    postsPerPage: 10
}
export const pagination = {
    pageIndex: 1,
    postsCount: 1,
    pagesCount: 1
}