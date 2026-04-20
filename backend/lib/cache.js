const NodeCache = require("node-cache");
const logger = require("./logger");

const REDIS_URL = process.env.REDIS_URL;

let impl;

if (REDIS_URL) {
    const Redis = require("ioredis");
    const client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: false,
        enableReadyCheck: true,
    });

    client.on("connect", () => logger.info("[cache] redis connected"));
    client.on("error", (err) => logger.error({ err: err.message }, "[cache] redis error"));

    impl = {
        kind: "redis",
        async get(key) {
            const v = await client.get(key);
            return v ? JSON.parse(v) : null;
        },
        async set(key, value, ttlSec) {
            await client.set(key, JSON.stringify(value), "EX", ttlSec);
        },
        async del(key) {
            await client.del(key);
        },
        async close() {
            await client.quit();
        },
    };
} else {
    logger.warn("[cache] REDIS_URL not set — using in-memory cache (dev only)");
    const mem = new NodeCache({ stdTTL: 300, checkperiod: 60, useClones: false });
    impl = {
        kind: "memory",
        async get(key) {
            return mem.get(key) ?? null;
        },
        async set(key, value, ttlSec) {
            mem.set(key, value, ttlSec);
        },
        async del(key) {
            mem.del(key);
        },
        async close() {
            mem.close();
        },
    };
}

const getOrSet = async (key, ttlSec, producer) => {
    const hit = await impl.get(key);
    if (hit !== null) {
        logger.debug({ key, kind: impl.kind }, "[cache] hit");
        return hit;
    }
    logger.debug({ key, kind: impl.kind }, "[cache] miss");
    const value = await producer();
    await impl.set(key, value, ttlSec);
    return value;
};

module.exports = { ...impl, getOrSet };
