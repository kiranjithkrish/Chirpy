import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function deleteUsers() {
    const result = await db.delete(users);
    console.log(`Deleted ${result.count} users`);
    if (result.count > 0) {
        console.log('Delete operation successful');
    }
    else {
        console.log('No users were deleted (table was already empty)');
    }
    return result.count;
}
