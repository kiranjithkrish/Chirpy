import { Request, Response } from "express";
import { respondWithJSON, responseWithError } from "./json.js";
import { BadRequest } from '../middlewares/error.js'

 export type JSONBody = {
    body: string
 }
 export type ResponseBody = {
    cleanedBody: string
 }
export async function handleValidateChirp(req: Request, res: Response) {
    let parsedBody: JSONBody = req.body;
    const chirp = parsedBody.body
    const cleanedChirp = profanityValidation(chirp)
    if (isValidLength(chirp) === false) {
        //responseWithError(res, 400, "Chirp is too long")
        throw new BadRequest("Chirp is too long. Max length is 140")
    }
    const responseBody: ResponseBody = {
        cleanedBody: cleanedChirp
    }
    respondWithJSON(res, 200, responseBody)

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
