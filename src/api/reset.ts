import { Request, Response } from "express"
import { config } from "../config.js"

export async function handleMetricsReset(req: Request, res: Response) {
    res.set('Content-type', 'text/plain')
    config.fileserverHits = 0
    res.send(`Hits: ${config.fileserverHits}`)
}
