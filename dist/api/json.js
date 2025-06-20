export function responseWithError(res, code, message) {
    respondWithJSON(res, code, { error: message });
}
export function respondWithJSON(res, code, payload) {
    res.setHeader('Content-Type', 'application/json');
    const body = JSON.stringify(payload);
    res.status(code).send(body);
}
