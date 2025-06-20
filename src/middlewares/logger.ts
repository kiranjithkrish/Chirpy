import { NextFunction, Request, Response } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish",() => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK]${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    })
    next()
}