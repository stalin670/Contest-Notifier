const env = require("../lib/env");

const notFound = (req, res, next) => {
    res.status(404).json({ error: "Route not found", path: req.originalUrl });
};

const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal server error";

    if (status >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
    }

    res.status(status).json({
        error: message,
        ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { notFound, errorHandler, asyncHandler };
