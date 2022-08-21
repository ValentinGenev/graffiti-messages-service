export enum Codes {
    Ok = 'OK',
    Created = 'CREATED',
    BadRequest = 'BAD_REQUEST',
    NotFound = 'NOT_FOUND',
    InternalServerError = 'INTERNAL_SERVER_ERROR',

    // Custom errors
    MissingData = 'MISSING_DATA',
    TooManyRequests = 'TOO_MANY_REQUESTS',
    MaxLengthExceeded = 'MAX_LENGTH_EXCEEDED'
}

export const MESSAGES = {
    internalServerError: 'Unexpected condition prevented the fulfillment of the request.',

    // Custom errors
    missingData: (data: string) => { return `Missing data: ${data}` },
    tooManyRequests: (data: number) => { return `You need to wait ${data} minutes before your next post` },
    maxLengthExceeded: 'Your message exceeds the maximum message length'
}

export const STATUSES: Record<string, number> = {
    'OK': 200,
    'CREATED': 201,
    'BAD_REQUEST': 400,
    'NOT_FOUND': 404,
    'INTERNAL_SERVER_ERROR': 500,

    // Custom errors
    'MISSING_DATA': 400,
    'TOO_MANY_REQUESTS': 403,
    'MAX_LENGTH_EXCEEDED': 400
}