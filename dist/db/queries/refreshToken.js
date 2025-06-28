import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
export async function insertRefreshToken(tokenObj) {
    const [result] = await db
        .insert(refreshTokens)
        .values(tokenObj)
        .returning();
    return result;
}
export async function getRefreshToken(token) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}
export async function revokeRefreshToken(token) {
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, token));
}
