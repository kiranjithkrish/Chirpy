import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, User, users } from "../schema.js";
import { UpdatedUser, UserBody } from "../../api/users.js";

export type UserResponse = Omit<User, 'hashedPassword'>
export async function createUser(user: NewUser): Promise<UserResponse> {
    console.log(user)
    const [result] = await db
                        .insert(users)
                        .values(user)
                        .onConflictDoNothing()
                        .returning();
    const {hashedPassword, ...userWithoutPassword} = result
    return userWithoutPassword
}

export async function getUser(user: UserBody): Promise<User> {
    const [result] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, user.email))
  
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

export async function updateUsers(newUser: UpdatedUser): Promise<User> {
    const [result] = await db
                        .update(users)
                        .set({ id: newUser.userId, hashedPassword: newUser.hashedPassword, email: newUser.email})
                        .where(eq(users.id, newUser.userId))
                        .returning()
    return result
}