import { Request, Response } from "express";
import { respondWithJSON, responseWithError } from "./json.js";
import { BadRequest, NotFoundError } from "./errors.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";


 export type JSONBody = {
    body: string
    userId: string
 }
 export type ResponseBody = {
    cleanedBody: string
 }
export async function handleChirp(req: Request, res: Response) {
    let parsedBody: JSONBody = req.body;
    const body = parsedBody.body
    const userId = parsedBody.userId
    if (!body) {
        throw new BadRequest('Body is required');
    }
    
    if (!userId) {
        throw new BadRequest('User ID is required');
    }
    console.log(`user id incoming is ${userId}`)
    const cleanedChirp = profanityValidation(body)
    if (isValidLength(body) === false) {
        throw new BadRequest("Chirp is too long. Max length is 140")
    }
    const newChirp: NewChirp = {
        body: cleanedChirp,
        userId: userId
    }
    const insertedChirp = await createChirp(newChirp)
    if (!insertedChirp) {
        throw new Error('Failed to insert chirp into db')
    }
    respondWithJSON(res, 201, insertedChirp)
}

export async function getAllChirps(req: Request, res: Response) {
    const chirps = await getChirps()
    if (!chirps) {
        throw new Error('Failed to get all the chirps')
    }
    respondWithJSON(res, 200, chirps)
}

export async function getChirpWithId(req: Request, res: Response) {
    const chirpId = req.params.chirpId
    const chirp = await getChirp(chirpId)
    if (!chirp) {
        throw new NotFoundError('Requested chirp is not found')
    }
    respondWithJSON(res, 200, chirp)
}
function isValidLength(text: string): boolean {
    const maxChirpLength = 140;
    return text.length > 140 ? false : true
}

function profanityValidation(text: string): string {
    const profanity = ["kerfuffle", "sharbert", "fornax"]
    const cleanedText = text.split(' ').map(word => {
        return profanity.includes(word.toLowerCase()) ? "****" : word
    }).join(' ')
    return cleanedText
}
