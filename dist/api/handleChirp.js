import { respondWithJSON } from "./json.js";
import { BadRequest } from "./errors.js";
export async function handleValidateChirp(req, res) {
    let parsedBody = req.body;
    const chirp = parsedBody.body;
    const cleanedChirp = profanityValidation(chirp);
    if (isValidLength(chirp) === false) {
        //responseWithError(res, 400, "Chirp is too long")
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    const responseBody = {
        cleanedBody: cleanedChirp
    };
    respondWithJSON(res, 200, responseBody);
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
