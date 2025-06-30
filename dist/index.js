import express from "express";
import { handleReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middlewares/logger.js";
import { middlewareMetricsInc } from "./middlewares/metrics.js";
import { handleMetrics } from "./api/metrics.js";
import { handleMetricsReset } from "./api/reset.js";
import { deleteChirpWithId, getAllChirps, getChirpWithId, handleChirp } from "./api/chirps.js";
import { errorHandler } from "./middlewares/error.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handleUpdateUser, handleUpgradeUser, handleUserCreation, handleUserLogin } from "./api/users.js";
import { handleRefreshToken, handleRevokeRefreshToken } from "./api/refreshToken.js";
const PORT = 8080;
const migrationClient = postgres(config.db.url, { max: 1 });
const db = drizzle(migrationClient);
console.log('Starting migrations...');
console.log('Migration folder:', config.db.migrationConfig.migrationsFolder);
try {
    await migrate(db, config.db.migrationConfig);
    console.log('Migrations completed successfully');
}
catch (error) {
    console.error('Migration failed:', error);
}
const app = express();
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", middlewareLogResponses, middlewareMetricsInc, handleReadiness);
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handleMetrics(req, res)).catch(next);
});
app.get('/api/chirps', middlewareLogResponses, (req, res, next) => {
    Promise.resolve(getAllChirps(req, res)).catch(next);
});
app.get('/api/chirps/:chirpId', middlewareLogResponses, (req, res, next) => {
    Promise.resolve(getChirpWithId(req, res)).catch(next);
});
app.delete('/api/chirps/:chirpID', middlewareLogResponses, (req, res, next) => {
    Promise.resolve(deleteChirpWithId(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handleMetricsReset(req, res)).catch(next);
});
app.post('/api/chirps', (req, res, next) => {
    Promise.resolve(handleChirp(req, res)).catch(next);
});
app.post('/api/users', (req, res, next) => {
    Promise.resolve(handleUserCreation(req, res).catch(next));
});
app.put('/api/users', (req, res, next) => {
    Promise.resolve(handleUpdateUser(req, res).catch(next));
});
app.post('/api/login', (req, res, next) => {
    Promise.resolve(handleUserLogin(req, res).catch(next));
});
app.post('/api/refresh', (req, res, next) => {
    Promise.resolve(handleRefreshToken(req, res).catch(next));
});
app.post('/api/revoke', (req, res, next) => {
    Promise.resolve(handleRevokeRefreshToken(req, res).catch(next));
});
app.post('/api/polka/webhooks', (req, res, next) => {
    Promise.resolve(handleUpgradeUser(req, res).catch(next));
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}`);
});
