import { and, eq } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
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
            throw new Error('Failed to insert the chirp into db')
        }
        return newChirp;
    } catch (error) {
        console.error('Error in createChirp:', error);
        throw error;
    }
}

export async function getChirps(authorId: string | null): Promise<Chirp[]> {
    const result = await db
                        .select()
                        .from(chirps)
                        .where(authorId ? eq(chirps.userId, authorId) : undefined)
    return result
}

export async function getChirp(chirpId: string): Promise< Chirp | undefined> {
    const [result] = await db
                            .select()
                            .from(chirps)
                            .where(eq(chirps.id, chirpId))
    return result
}

export async function deleteChirp(chirpId: string): Promise<boolean> {
    const result = await db.delete(chirps)
            .where(eq(chirps.id, chirpId))
            .returning()
    return result.length > 0
}

