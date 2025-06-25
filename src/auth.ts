import bcrypt from 'bcrypt'
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

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
            throw new Error('Invalid or missing user ID in token');
        }
        return userId
    } catch(err) {
        if (err instanceof TokenExpiredError) {
            throw new Error('JWT token has expired')
        } else if (err instanceof JsonWebTokenError) {
            throw new Error('Invalid JWT signature')
        }
        throw new Error('JWT Error: ' + (err as Error))
    }

}