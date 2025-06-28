import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    hashedPassword: varchar("hashed_password").notNull().default('unset'),
    email: varchar("email", { length: 256 }).unique().notNull(),
});
export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: text("body").notNull(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" })
});
export const refreshTokens = pgTable("refresh_token", {
    token: text("token").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expired_at").notNull(),
    revokedAt: timestamp("revoked_at")
});
