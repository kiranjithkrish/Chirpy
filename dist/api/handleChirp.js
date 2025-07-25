import { respondWithJSON } from "./json.js";
import { BadRequest } from "./errors.js";
import { createChirp } from "../db/queries/chirp.js";
export async function handleChirp(req, res) {
    let parsedBody = req.body;
    const body = parsedBody.body;
    const userId = parsedBody.userId;
    if (!body) {
        throw new BadRequest('Body is required');
    }
    if (!userId) {
        throw new BadRequest('User ID is required');
    }
    console.log(`user id incoming is ${userId}`);
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
