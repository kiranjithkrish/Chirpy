import { Request, Response } from "express";
import { createUser, getUser } from "../db/queries/users.js";
import { NewUser, User } from "../db/schema.js";
import { BadRequest, Unauthorised } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, hashPassword } from "../auth.js";

export type UserBody = {
    email: string
    password: string
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
    const userBody = req.body
    const emailVal = userBody.email
    const password = userBody.password
    if (!emailVal) {
        throw new BadRequest('Email is required')
    }
    if (!password) {
        throw new BadRequest('Password is required')
    }
    const user: User = await getUser({ email: emailVal, password: password})
    const match = await checkPasswordHash(password, user.hashedPassword)
    if (!match) {
        throw new Unauthorised('Incorrect email or password')
    }
    const { hashedPassword, ...userWithoutPassword } = user
    respondWithJSON(res, 200, userWithoutPassword)
}