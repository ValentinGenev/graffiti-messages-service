export const CODES: Record<string, string> = {
    ok: 'OK',
    created: 'CREATED',
    badRequest: 'BAD_REQUEST',
    notFound: 'NOT_FOUND',
    internalServerError: 'INTERNAL_SERVER_ERROR',

    // Custom errors
    missingData: 'MISSING_DATA',
    tooManyRequests: 'TOO_MANY_REQUESTS',
    maxLengthExceeded: 'MAX_LENGTH_EXCEEDED'
}

export const MESSAGES = {
    internalServerError: 'Unexpected condition prevented the fulfillment of the request.',

    // Custom errors
    missingData: (data: string) => { return `Missing data: ${data}` },
    tooManyRequests: (data: number) => { return `You need to wait ${data} minutes before your next post` },
    maxLengthExceeded: 'Your message exceeds the maximum message length'
}

export const STATUS_CODES: Record<string, number> = {
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