require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const rateLimit = require("express-rate-limit");

const env = require("./lib/env.js");
const logger = require("./lib/logger.js");
const connectDB = require("./lib/db.js");
const cache = require("./lib/cache.js");
const cronJobs = require("./lib/cron.js");
const contestRoutes = require("./routes/contest.route.js");
const pushRoutes = require("./routes/push.route.js");
const { notFound, errorHandler } = require("./middleware/errorHandler.js");
const { requestId } = require("./middleware/requestId.js");

const app = express();

app.set("trust proxy", 1);
app.use(requestId);
app.use(
    pinoHttp({
        logger,
        customProps: (req) => ({ reqId: req.id }),
        autoLogging: { ignore: (req) => req.url === "/healthz" },
    })
);
app.use(helmet());
app.use(
    cors({
        origin: env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json({ limit: "100kb" }));

app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    })
);

app.get("/", (req, res) => res.status(200).json({ data: "Api is running successfully" }));
app.get("/healthz", (req, res) =>
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        cache: cache.kind,
    })
);

app.use("/api/contests", contestRoutes);
app.use("/api/push", pushRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
    try {
        await connectDB();
        const server = app.listen(env.PORT, () => {
            logger.info(`Server listening on :${env.PORT} (${env.NODE_ENV}) cache=${cache.kind}`);
            cronJobs.start();
        });

        const shutdown = async (signal) => {
            logger.info(`${signal} received, shutting down`);
            server.close(() => logger.info("http closed"));
            await cache.close().catch(() => {});
            process.exit(0);
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (err) {
        logger.fatal({ err: err.message }, "startup failed");
        process.exit(1);
    }
};

process.on("unhandledRejection", (err) => logger.error({ err }, "unhandledRejection"));
process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "uncaughtException");
    process.exit(1);
});

start();
