import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser): Promise<NewUser> {
    const [result] = await db
                        .insert(users)
                        .values(user)
                        .onConflictDoNothing()
                        .returning();
    return result
}

export async function deleteUsers(): Promise<number> {
    const result = await db.delete(users)
    console.log(`Deleted ${result.count } users`)
    
    if (result.count > 0) {
        console.log('Delete operation successful')
    } else {
        console.log('No users were deleted (table was already empty)')
    }
    
    return result.count 
}