import { Request, Response } from "express";
import { createUser, getUser, updateUsers } from "../db/queries/users.js";
import { NewRefreshToken, NewUser, User } from "../db/schema.js";
import { BadRequest, Unauthorised } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "../auth.js";
import { jwtSecret } from "../config.js";
import { insertRefreshToken } from "../db/queries/refreshToken.js";

export type UserBody = {
    email: string
    password: string
    expiryInSeconds: number
}

export async function handleUserCreation(req: Request, res: Response) {
    const userBody: UserBody = req.body
    const emailVal = userBody.email
    const password = userBody.password
    if (!emailVal) {
        throw new BadRequest('Email is required')
    }
    if (!password) {
        throw new BadRequest('Password is required')
    }
    const newUser: NewUser = {
        email: emailVal,
        hashedPassword: await hashPassword(password)
    }
    try {
        const userRes = await createUser(newUser)
        respondWithJSON(res, 201, userRes)
    } catch (err: any) {
        throw new Error('User creation failed unexpectedly')
    }    
}

export async function handleUserLogin(req: Request, res: Response) {
    const userBody: UserBody = req.body
    const emailVal = userBody.email
    const password = userBody.password
    const expiryInSeconds = Number(userBody.expiryInSeconds) 
    let jwtExpiry: number
    if (isNaN(expiryInSeconds) || expiryInSeconds <= 0) {
        jwtExpiry = 3600
    } else {
        jwtExpiry = expiryInSeconds > 3600 ? 3600 : expiryInSeconds
    }
    if (!emailVal) {
        throw new BadRequest('Email is required')
    }
    if (!password) {
        throw new BadRequest('Password is required')
    }
    const user: User = await getUser({ email: emailVal, password: password, expiryInSeconds: jwtExpiry})
    const match = await checkPasswordHash(password, user.hashedPassword)
    if (!match) {
        throw new Unauthorised('Incorrect email or password')
    }
    const refreshToken = makeRefreshToken()
    const refreshTokenToInsert: NewRefreshToken = {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)) 
    }
    const refreshTokenInfo = await insertRefreshToken(refreshTokenToInsert)
    if (!refreshTokenInfo) {
        throw new Error('Failed to insert the refresh token')
    }
    const jwtToken = makeJWT(user.id, jwtExpiry, jwtSecret)
    const { hashedPassword, ...userWithoutPassword } = user
    respondWithJSON(res, 200, { ...userWithoutPassword , token: jwtToken, refreshToken: refreshTokenInfo.token })
}


export type UpdatedUser = {
    email: string
    userId: string
    hashedPassword: string
}
export async function handleUpdateUser(req: Request, res: Response) {
    const userBody: UserBody = req.body
    const emailVal = userBody.email
    const password = userBody.password
    const authHeader = req.get('Authorization')
    if(!authHeader) {
        throw new Unauthorised('Missing access token')
    }
    const accessToken = getBearerToken(req)
    console.log('About to validate JWT with secret length for user update:', jwtSecret.length)
    const userId = validateJWT(accessToken, jwtSecret)
    if (!userId) {
        throw new Unauthorised('HandleUserUpdateError: Not Authorised')
    }
    console.log('JWT validation successful, userId:', userId)
       const newUser = {
        email: emailVal,
        userId: userId,
        hashedPassword: await hashPassword(password)
    }
    const updatedUser = await updateUsers(newUser)
    const { hashedPassword, ...userWithoutPassword } = updatedUser
    respondWithJSON(res, 200, userWithoutPassword)

}