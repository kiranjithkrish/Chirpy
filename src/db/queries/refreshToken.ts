import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, RefreshToken, refreshTokens } from "../schema.js";


export async function insertRefreshToken(tokenObj: NewRefreshToken): Promise<RefreshToken> {
    const [result] = await db
                        .insert(refreshTokens)
                        .values(tokenObj)
                        .returning()

    return result
}

export async function getRefreshToken(token: string): Promise<RefreshToken> {
    const [result] = await db
                        .select()
                        .from(refreshTokens)
                        .where(eq(refreshTokens.token, token))
    return result
}


export async function revokeRefreshToken(token: string) {
    await db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(eq(refreshTokens.token, token))
}