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
        console.log('Insert result:', result);
        const [newChirp] = result;
        if (!newChirp) {
            throw new Error('Failed to insert the chirp into db');
        }
        console.log(`user id for chirp in db is ${newChirp.userId}`);
        return newChirp;
    }
    catch (error) {
        console.error('Error in createChirp:', error);
        throw error;
    }
}
