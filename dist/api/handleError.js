export function errorHandler(err, req, res, next) {
    console.log("Chrping what the fuct? tto long");
    console.log(err.message);
    res.status(500).json({ "error": "Something went wrong on our end" });
}
