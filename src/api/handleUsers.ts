import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequest } from "./errors.js";
import { respondWithJSON } from "./json.js";

type UserBody = {
    email: string
}
export async function handleUserCreation(req: Request, res: Response) {
    const userBody: UserBody = req.body
    const emailVal = userBody.email
    if (!emailVal) {
        throw new BadRequest('Email is required')
    }
    const newUser: NewUser = {
        email: emailVal
    }
    try {
        const userRes = await createUser(newUser)
        respondWithJSON(res, 201, userRes)
    } catch (err: any) {
        throw new Error('User creation failed unexpectedly')
    }    
}