import { createUser } from "../db/queries/users.js";
import { BadRequest } from "./errors.js";
import { respondWithJSON } from "./json.js";
export async function handleUserCreation(req, res) {
    const userBody = req.body;
    const emailVal = userBody.email;
    if (!emailVal) {
        throw new BadRequest('Email is required');
    }
    const newUser = {
        email: emailVal
    };
    try {
        const userRes = await createUser(newUser);
        respondWithJSON(res, 201, userRes);
    }
    catch (err) {
        throw new Error('User creation failed unexpectedly');
    }
}
