process.loadEnvFile();
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} does not exist`);
    }
    return value;
}
export const config = {
    fileserverHits: 0,
    dbUrl: envOrThrow("DB_URL")
};
