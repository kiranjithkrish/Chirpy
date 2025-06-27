import { MigrationConfig } from "drizzle-orm/migrator";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

process.loadEnvFile()
export function envOrThrow(key: string) {
  const value = process.env[key];
  if(!value) {
    throw new Error(`Environment variable ${key} does not exist`)
  }
  return value
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig
}
type APIConfig = {
  fileserverHits: number;
  dbUrl: string;
  platform: string
};

type Config = {
  api: APIConfig
  db: DBConfig
}

export const apiConfig: APIConfig = {
    fileserverHits: 0,
    dbUrl: envOrThrow("DB_URL"),
    platform: envOrThrow("PLATFORM")
}

const dbConfig: DBConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig
}

export const jwtSecret: string = envOrThrow("JWT_SECRET")

export const config: Config = {
  api: apiConfig,
  db: dbConfig
}
