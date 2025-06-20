import express from "express";
import { handleReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middlewares/logger.js";
import { middlewareMetricsInc } from "./middlewares/metrics.js";
import { handleMetrics } from "./api/metrics.js";
import { handleMetricsReset } from "./api/reset.js";
import { handleValidateChirp } from "./api/handleChirp.js";
import { errorHandler } from "./middlewares/error.js";
const PORT = 8080;
const app = express();
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", middlewareLogResponses, middlewareMetricsInc, handleReadiness);
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handleMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handleMetricsReset(req, res)).catch(next);
});
app.post('/api/validate_chirp', (req, res, next) => {
    Promise.resolve(handleValidateChirp(req, res)).catch(next);
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}`);
});
