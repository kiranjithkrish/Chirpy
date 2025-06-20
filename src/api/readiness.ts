import { Request, Response } from "express"


export const handleReadiness = async (req: Request, res: Response): Promise<void> => {
    res.set('Content-type', 'text/plain')
    res.send("OK")
}