import { createUser, getUser } from "../db/queries/users.js";
import { BadRequest, Unauthorised } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, hashPassword, makeJWT } from "../auth.js";
import { jwtSecret } from "../config.js";
export async function handleUserCreation(req, res) {
    const userBody = req.body;
    const emailVal = userBody.email;
    const password = userBody.password;
    if (!emailVal) {
        throw new BadRequest('Email is required');
    }
    if (!password) {
        throw new BadRequest('Password is required');
    }
    const newUser = {
        email: emailVal,
        hashedPassword: await hashPassword(password)
    };
    try {
        const userRes = await createUser(newUser);
        respondWithJSON(res, 201, userRes);
    }
    catch (err) {
        throw new Error('User creation failed unexpectedly');
    }
}
export async function handleUserLogin(req, res) {
    const userBody = req.body;
    const emailVal = userBody.email;
    const password = userBody.password;
    const expiryInSeconds = Number(userBody.expiryInSeconds);
    let jwtExpiry;
    if (isNaN(expiryInSeconds) || expiryInSeconds <= 0) {
        jwtExpiry = 3600;
    }
    else {
        jwtExpiry = expiryInSeconds > 3600 ? 3600 : expiryInSeconds;
    }
    if (!emailVal) {
        throw new BadRequest('Email is required');
    }
    if (!password) {
        throw new BadRequest('Password is required');
    }
    const user = await getUser({ email: emailVal, password: password, expiryInSeconds: jwtExpiry });
    const match = await checkPasswordHash(password, user.hashedPassword);
    if (!match) {
        throw new Unauthorised('Incorrect email or password');
    }
    const jwtToken = makeJWT(user.id, jwtExpiry, jwtSecret);
    const { hashedPassword, ...userWithoutPassword } = user;
    respondWithJSON(res, 200, { ...userWithoutPassword, token: jwtToken });
}
