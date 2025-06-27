import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jwt;
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
            throw new Error('Invalid or missing user ID in token');
        }
        return userId;
    }
    catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new Error('JWT token has expired');
        }
        else if (err instanceof JsonWebTokenError) {
            throw new Error('Invalid JWT signature');
        }
        throw new Error('JWT Error: ' + err);
    }
}
export function getBearerToken(req) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Error('Authorization header is empty');
    }
    if (!authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization should start with "Bearer "');
    }
    const tokenString = authHeader.substring(7);
    return tokenString;
}
