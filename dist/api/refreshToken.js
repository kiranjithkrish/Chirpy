import { getBearerToken, makeJWT } from "../auth.js";
import { getRefreshToken, revokeRefreshToken } from "../db/queries/refreshToken.js";
import { Unauthorised } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { jwtSecret } from "../config.js";
export async function handleRefreshToken(req, res) {
    const token = getBearerToken(req);
    const tokenInfoFromDb = await getRefreshToken(token);
    if (!tokenInfoFromDb) {
        throw new Unauthorised('You have no refresh token');
    }
    if (tokenInfoFromDb.revokedAt) {
        throw new Unauthorised('Your refresh token token was revoked');
    }
    const jwtToken = makeJWT(tokenInfoFromDb.userId, 60 * 60, jwtSecret);
    if (!jwtToken) {
        new Error('Failed to make jwt from handleRefresh');
    }
    respondWithJSON(res, 200, { token: jwtToken });
}
export async function handleRevokeRefreshToken(req, res) {
    const token = getBearerToken(req);
    const tokenInfoFromDb = await getRefreshToken(token);
    if (!tokenInfoFromDb) {
        throw new Unauthorised('You have no refresh token');
    }
    try {
        await revokeRefreshToken(tokenInfoFromDb.token);
        res.status(204).end();
    }
    catch (err) {
        throw new Error(`Revoke refresh token failed: ${err}`);
    }
}
