export function errorHandler(err, req, res, next) {
    console.log(`Error handler called with message: ${err.message}`);
    res.setHeader('Content-Type', 'application/json');
    if (err instanceof NotFoundError) {
        res.status(404).json({ "error": err.message });
    }
    else if (err instanceof BadRequest) {
        res.status(400).json({ "error": err.message });
    }
    else if (err instanceof Unauthorised) {
        res.status(401).json({ "error": err.message });
    }
    else if (err instanceof Forbidden) {
        res.status(403).json({ "error": err.message });
    }
    else {
        res.status(500).json({ "error": "Something went wrong on our end" });
    }
}
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
export class BadRequest extends Error {
    constructor(message) {
        super(message);
    }
}
export class Unauthorised extends Error {
    constructor(message) {
        super(message);
    }
}
export class Forbidden extends Error {
    constructor(message) {
        super(message);
    }
}
