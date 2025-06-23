import { config } from "../config.js";
import { Forbidden } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handleMetricsReset(req, res) {
    if (config.api.platform !== "dev") {
        throw new Forbidden('Reset is only allowed for dev platform');
    }
    res.set('Content-type', 'text/plain');
    const count = await deleteUsers();
    res.send(`Success: ${count} users deleted`);
}
