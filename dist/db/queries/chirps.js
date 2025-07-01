import { asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    console.log('createChirp called with:', chirp);
    console.log('chirp.body:', chirp.body);
    console.log('chirp.userId:', chirp.userId);
    console.log('typeof chirp.userId:', typeof chirp.userId);
    try {
        const result = await db
            .insert(chirps)
            .values({
            body: chirp.body,
            userId: chirp.userId
        })
            .returning();
        const [newChirp] = result;
        if (!newChirp) {
            throw new Error('Failed to insert the chirp into db');
        }
        return newChirp;
    }
    catch (error) {
        console.error('Error in createChirp:', error);
        throw error;
    }
}
export async function getChirps(authorId, sort) {
    let orderByClause;
    if (sort === 'desc') {
        orderByClause = desc(chirps.createdAt);
    }
    else {
        orderByClause = asc(chirps.createdAt);
    }
    const result = await db
        .select()
        .from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(orderByClause);
    return result;
}
export async function getChirp(chirpId) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}
export async function deleteChirp(chirpId) {
    const result = await db.delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result.length > 0;
}
