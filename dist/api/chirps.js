import { respondWithJSON } from "./json.js";
import { BadRequest, Forbidden, NotFoundError, Unauthorised } from "./errors.js";
import { createChirp, deleteChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { jwtSecret } from "../config.js";
export async function handleChirp(req, res) {
    let parsedBody = req.body;
    const body = parsedBody.body;
    // Debug the authorization header
    const authHeader = req.get('Authorization');
    const jwtToken = getBearerToken(req);
    if (!body) {
        throw new BadRequest('Body is required');
    }
    const userId = validateJWT(jwtToken, jwtSecret);
    console.log('JWT validation successful, userId:', userId);
    const cleanedChirp = profanityValidation(body);
    if (isValidLength(body) === false) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    const newChirp = {
        body: cleanedChirp,
        userId: userId
    };
    const insertedChirp = await createChirp(newChirp);
    if (!insertedChirp) {
        throw new Error('Failed to insert chirp into db');
    }
    respondWithJSON(res, 201, insertedChirp);
}
export async function deleteChirpWithId(req, res) {
    const userBody = req.body;
    const chirpId = req.params.chirpID;
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Unauthorised('Missing access token');
    }
    const accessToken = getBearerToken(req);
    const userId = validateJWT(accessToken, jwtSecret);
    if (!userId) {
        throw new Unauthorised('HandleUserUpdateError: Not Authorised');
    }
    console.log('JWT validation successful, userId:', userId);
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError('Chirp to delete is not found');
    }
    if (chirp.userId !== userId) {
        throw new Forbidden('You are not authorised to delete this chirp');
    }
    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
        throw new NotFoundError('Your chirp is not found');
    }
    res.status(204).send();
}
export async function getAllChirps(req, res) {
    const authorIdQuery = req.query.authorId;
    let authorId = "empty";
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    console.log(`Author id ************** ${authorId}`);
    const chirps = await getChirps(authorId);
    if (!chirps) {
        throw new Error('Failed to get all the chirps');
    }
    respondWithJSON(res, 200, chirps);
}
export async function getChirpWithId(req, res) {
    const chirpId = req.params.chirpId;
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError('Requested chirp is not found');
    }
    respondWithJSON(res, 200, chirp);
}
function isValidLength(text) {
    const maxChirpLength = 140;
    return text.length > 140 ? false : true;
}
function profanityValidation(text) {
    const profanity = ["kerfuffle", "sharbert", "fornax"];
    const cleanedText = text.split(' ').map(word => {
        return profanity.includes(word.toLowerCase()) ? "****" : word;
    }).join(' ');
    return cleanedText;
}
