// FIXME: run the database setup only for the DAL tests
import { failureResponse, successResponse } from '../mock/data'
import { database } from '../../src'
import { getStatus, handleInternalError } from '../../src/utilities/responses'
import { Codes, STATUSES } from '../../src/utilities/http-responses'

describe('Responses functions tests:', () => {
    describe('getStatus suite', () => {
        test('getStatus(successResponse)', () => {
            const result = getStatus(successResponse)

            expect(result === STATUSES[Codes.Ok]).toBeTruthy()
        })

        test('getStatus(failureResponse)', () => {
            const result = getStatus(failureResponse)

            expect(failureResponse.error && result
                === STATUSES[failureResponse.error?.code]).toBeTruthy()
        })
    })

    test('handleInternalError(error, failureResponse)', () => {
        const response = {
            status: () => {},
            json: () => {}
        }
        jest.spyOn(console, 'log')
        jest.spyOn(response, 'status')
        jest.spyOn(response, 'json')

        handleInternalError(new Error('Test'), response)

        expect(response.status).toHaveBeenCalled()
        expect(response.json).toHaveBeenCalled()
        expect(console.log).toHaveBeenCalled()
    })

    afterAll(() => {
        database.end()
    })
})