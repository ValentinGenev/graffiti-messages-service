// FIXME: run the database setup only for the DAL tests
import { failureResponse, successResponse } from '../mock/data'
import { database } from '../../src'
import { getStatusCode, handleHttpError } from '../../src/utilities/handle-http-error'
import { CODES, STATUS_CODES } from '../../src/utilities/http-responses'
import { Logger } from '../../src/lib/logger'

describe('HTTP error functions tests:', () => {
    test('handleHttpError(error, failureResponse)', () => {
        const response = {
            status: () => {},
            json: () => {},
            req: {
                url: '/api/v1/messages'
            }
        }
        jest.spyOn(Logger, 'error')
        jest.spyOn(response, 'status')
        jest.spyOn(response, 'json')

        handleHttpError(new Error('Test'), response)

        expect(Logger.error).toHaveBeenCalled()
        expect(response.status).toHaveBeenCalled()
        expect(response.json).toHaveBeenCalled()
    })

    describe('getStatusCode suite', () => {
        test('getStatusCode(successResponse)', () => {
            const result = getStatusCode(successResponse)

            expect(result === STATUS_CODES[CODES.ok]).toBeTruthy()
        })

        test('getStatusCode(failureResponse)', () => {
            const result = getStatusCode(failureResponse)

            expect(failureResponse.error && result
                === STATUS_CODES[failureResponse.error?.code]).toBeTruthy()
        })
    })

    afterAll(() => {
        database.end()
    })
})