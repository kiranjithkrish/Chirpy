import bcrypt from 'bcrypt'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
const { JsonWebTokenError, TokenExpiredError } = jwt;
import type { JwtPayload } from 'jsonwebtoken';
import { BadRequest, Unauthorised } from './api/errors';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    return encryptedPassword
}

export async function checkPasswordHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iatVal = Math.floor(Date.now()/1000)
    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: iatVal,
        exp: iatVal + expiresIn
    }
    const secretToken = secret
    const options: jwt.SignOptions = { algorithm: 'HS256'}
    const signedJWT =  jwt.sign(payload, secretToken, options)
    return signedJWT

}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const jwtPayload = jwt.verify(tokenString, secret) as jwt.JwtPayload
        const userId = jwtPayload.sub
        if (!userId) {
            throw new BadRequest('Invalid or missing user ID in token');
        }
        return userId
    } catch(err) {
        if (err instanceof TokenExpiredError) {
            throw new Unauthorised('JWT token has expired')
        } else if (err instanceof JsonWebTokenError) {
            throw new Unauthorised('Invalid JWT signature')
        }
        throw new Unauthorised('JWT Error: ' + (err as Error))
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        throw new BadRequest('Authorization header is empty')
    }
    return extractBearerToken(authHeader)
}

export function extractBearerToken(authHeader: string) {
    if (!authHeader.startsWith('Bearer ')) {
        throw new BadRequest('Authorization should start with "Bearer "')
    }
    const items = authHeader.split(' ')
    const tokenString = items[1]
    return tokenString
}