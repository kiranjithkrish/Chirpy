process.loadEnvFile();
export function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} does not exist`);
    }
    return value;
}
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const apiConfig = {
    fileserverHits: 0,
    dbUrl: envOrThrow("DB_URL"),
    platform: envOrThrow("PLATFORM"),
    polkaKey: envOrThrow("POLKA_KEY")
};
const dbConfig = {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
};
export const jwtSecret = envOrThrow("JWT_SECRET");
export const config = {
    api: apiConfig,
    db: dbConfig
};
