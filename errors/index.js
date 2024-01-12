const httpStatusCode = require('./httpStatusCode');

class BaseError extends Error {
    constructor(name, httpCode, isOperational, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

class APIError extends BaseError {
    constructor(name, httpCode = httpStatusCode.INTERNAL_SERVER, isOperational = true, message = 'internal server error') {
        super(name, httpCode, isOperational, message);
    }
}

class NotFoundError extends APIError {
    constructor() {
        super('Not Found', httpStatusCode.NOT_FOUND, true, 'No results found')
    }
}

module.exports = {
    NotFoundError,
}