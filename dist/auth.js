import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jwt;
import { BadRequest, Unauthorised } from './api/errors.js';
import crypto from 'crypto';
export async function hashPassword(password) {
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
}
export async function checkPasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}
export function makeJWT(userID, expiresIn, secret) {
    const iatVal = Math.floor(Date.now() / 1000);
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: iatVal,
        exp: iatVal + expiresIn
    };
    const secretToken = secret;
    const options = { algorithm: 'HS256' };
    const signedJWT = jwt.sign(payload, secretToken, options);
    return signedJWT;
}
export function validateJWT(tokenString, secret) {
    try {
        const jwtPayload = jwt.verify(tokenString, secret);
        const userId = jwtPayload.sub;
        if (!userId) {
            throw new BadRequest('Invalid or missing user ID in token');
        }
        return userId;
    }
    catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new Unauthorised('JWT token has expired');
        }
        else if (err instanceof JsonWebTokenError) {
            throw new Unauthorised('Invalid JWT signature');
        }
        throw new Unauthorised('JWT Error: ' + err);
    }
}
export function getBearerToken(req) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new BadRequest('Authorization header is empty');
    }
    return extractBearerToken(authHeader);
}
export function extractBearerToken(authHeader) {
    if (!authHeader.startsWith('Bearer ')) {
        throw new BadRequest('Authorization should start with "Bearer "');
    }
    const items = authHeader.split(' ');
    const tokenString = items[1];
    return tokenString;
}
export function getAPIKey(req) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Unauthorised('Authorization header is empty');
    }
    return extractAPIKey(authHeader);
}
export function extractAPIKey(header) {
    if (!header.startsWith('ApiKey ')) {
        throw new Unauthorised('Authorization should start with "Bearer "');
    }
    const items = header.split(' ');
    const tokenString = items[1];
    return tokenString;
}
export function makeRefreshToken() {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}
