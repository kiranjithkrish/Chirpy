import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    return encryptedPassword
}

export async function checkPasswordHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}