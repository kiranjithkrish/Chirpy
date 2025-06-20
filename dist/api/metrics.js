import { config } from "../config.js";
export async function handleMetrics(req, res) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    const requestCount = config.fileserverHits;
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${requestCount} times!</p>
  </body>
</html>`);
}
