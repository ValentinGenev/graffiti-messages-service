import { Message } from '../src/interfaces/IMessage'
import { convertUnixToDbTime, posterIsSpamming } from '../src/utilities/helper-functions'

describe('Helper functions tests:', () => {
    const lastPost: Message = {
        post_date: '2022-01-01T00:00:00.000Z',
        poster_id: 'randomfingerprintstring_test_utilities',
        poster: 'Jon Doe',
        message: 'Test message'
    }

    test('convertUnixToDbTime()', () => {
        const pastDate = new Date('2022-01-01T00:00:00.000Z').getTime()

        expect(lastPost.post_date === convertUnixToDbTime(pastDate)).toBeTruthy()
    })
    test('posterIsSpamming() last post days ago', () => {
        expect(posterIsSpamming(lastPost)).toBeFalsy()
    })
    test('posterIsSpamming() last post under default timeLimit', () => {
        lastPost.post_date = convertUnixToDbTime(Date.now() - 60000)

        expect(posterIsSpamming(lastPost)).toBeTruthy()
    })
    test('posterIsSpamming() last post before default timLimit', () => {
        lastPost.post_date = convertUnixToDbTime(Date.now() - 180000)

        expect(posterIsSpamming(lastPost)).toBeFalsy()
    })
    test('posterIsSpamming() last post under custom timeLimit', () => {
        lastPost.post_date = convertUnixToDbTime(Date.now() - 30000)

        expect(posterIsSpamming(lastPost, 60000)).toBeTruthy()
    })
})