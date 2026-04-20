const cron = require("node-cron");
const logger = require("./logger");
const cache = require("./cache");
const svc = require("../services/contest.service");
const notifier = require("../services/notifier.service");

const WARMUP_SCHEDULE = "*/10 * * * *";
const NOTIFY_SCHEDULE = "*/5 * * * *";

const warmup = async () => {
    const start = Date.now();
    try {
        await cache.del("all:normalized");
        await cache.del("cf:raw");
        await cache.del("clist:leetcode.com:raw");
        await cache.del("clist:codechef.com:raw");
        await cache.del("clist:atcoder.jp:raw");
        await svc.fetchAllNormalized();
        logger.info({ ms: Date.now() - start }, "[cron] cache warmed");
    } catch (err) {
        logger.error({ err: err.message }, "[cron] warmup failed");
    }
};

const notify = async () => {
    try {
        await notifier.dispatchUpcomingReminders();
    } catch (err) {
        logger.error({ err: err.message }, "[cron] notify failed");
    }
};

const start = () => {
    cron.schedule(WARMUP_SCHEDULE, warmup);
    cron.schedule(NOTIFY_SCHEDULE, notify);
    warmup().catch(() => {});
    logger.info(`[cron] warmup=${WARMUP_SCHEDULE} notify=${NOTIFY_SCHEDULE}`);
};

module.exports = { start, warmup };
