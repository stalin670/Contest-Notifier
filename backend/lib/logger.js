const pino = require("pino");
const env = require("./env");

const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug",
    base: { env: env.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(env.NODE_ENV !== "production" && {
        transport: {
            target: "pino-pretty",
            options: { colorize: true, translateTime: "SYS:HH:MM:ss.l", ignore: "pid,hostname" },
        },
    }),
});

module.exports = logger;
