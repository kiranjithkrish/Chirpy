import { Request, Response } from "express";
import { respondWithJSON, responseWithError } from "./json.js";
import { BadRequest, Forbidden, NotFoundError, Unauthorised } from "./errors.js";
import { createChirp, deleteChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { jwtSecret } from "../config.js";
import { UserBody } from "./users.js";

 export type JSONBody = {
    body: string
 }

 export type ResponseBody = {
    cleanedBody: string
 }
export async function handleChirp(req: Request, res: Response) {
    let parsedBody: JSONBody = req.body;
    const body = parsedBody.body
    // Debug the authorization header
    const authHeader = req.get('Authorization')
    const jwtToken = getBearerToken(req)
    if (!body) {
        throw new BadRequest('Body is required');
    }
    const userId = validateJWT(jwtToken, jwtSecret)
    console.log('JWT validation successful, userId:', userId)
    
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
export async function deleteChirpWithId(req: Request, res: Response) {
    const userBody: UserBody = req.body
    const chirpId = req.params.chirpID
    const authHeader = req.get('Authorization')
    if(!authHeader) {
        throw new Unauthorised('Missing access token')
    }
    const accessToken = getBearerToken(req)
    const userId = validateJWT(accessToken, jwtSecret)
    if (!userId) {
        throw new Unauthorised('HandleUserUpdateError: Not Authorised')
    }
    console.log('JWT validation successful, userId:', userId)
    const chirp = await getChirp(chirpId)
    if (!chirp) {
        throw new NotFoundError('Chirp to delete is not found')
    }
    if (chirp.userId !== userId) {
        throw new Forbidden('You are not authorised to delete this chirp')
    }
    const deleted = await deleteChirp(chirpId)
    if (!deleted) {
        throw new NotFoundError('Your chirp is not found')
    }
    res.status(204).send()
}
export async function getAllChirps(req: Request, res: Response) {
    const authorIdQuery = req.query.authorId;
    const sort = req.query.sort
    let authorId = null;
    let sortOption = null;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    if (typeof sort === 'string') {
        sortOption = sort;
    }
    const chirps = await getChirps(authorId, sortOption)
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
