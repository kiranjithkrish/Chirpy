import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    console.log(user);
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    const { hashedPassword, ...userWithoutPassword } = result;
    return userWithoutPassword;
}
export async function getUser(user) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email));
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
export async function updateUsers(newUser) {
    const [result] = await db
        .update(users)
        .set({ hashedPassword: newUser.hashedPassword, email: newUser.email })
        .where(eq(users.id, newUser.userId))
        .returning();
    return result;
}
export async function upgradeUsers(userId) {
    const [result] = await db
        .update(users)
        .set({ isChirpyRed: true })
        .where(eq(users.id, userId))
        .returning();
    return result;
}
