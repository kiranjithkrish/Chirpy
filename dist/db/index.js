import postgres from "postgres";
import { config } from "../config.js";
import * as schema from './schema.js';
import { drizzle } from "drizzle-orm/postgres-js";
const connection = postgres(config.db.url);
export const db = drizzle(connection, { schema });
