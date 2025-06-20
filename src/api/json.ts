import { Response } from "express";

export function responseWithError(res: Response, code: number, message: string) {
    respondWithJSON(res, code, { error: message})
}

export function respondWithJSON(res: Response, code: number, payload: any) {
    res.setHeader('Content-Type', 'application/json')
    const body = JSON.stringify(payload)
    res.status(code).send(body)
}