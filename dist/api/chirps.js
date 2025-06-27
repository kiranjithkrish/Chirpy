import { respondWithJSON } from "./json.js";
import { BadRequest, NotFoundError } from "./errors.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { jwtSecret } from "../config.js";
export async function handleChirp(req, res) {
    let parsedBody = req.body;
    const body = parsedBody.body;
    // Debug the authorization header
    const authHeader = req.get('Authorization');
    console.log('Raw Authorization header:', authHeader);
    const jwtToken = getBearerToken(req);
    console.log(`Extracted token is: ${jwtToken}`);
    console.log(`Token length: ${jwtToken.length}`);
    console.log(`First 50 chars: ${jwtToken.substring(0, 50)}...`);
    if (!body) {
        throw new BadRequest('Body is required');
    }
    // Add debugging to JWT validation
    console.log('About to validate JWT with secret length:', jwtSecret.length);
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
export async function getAllChirps(req, res) {
    const chirps = await getChirps();
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
