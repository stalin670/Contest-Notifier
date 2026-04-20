const axios = require("axios");
const env = require("../lib/env");
const cache = require("../lib/cache");
const { normalizeCodeforces, normalizeClist } = require("../lib/dto");

const CLIST_API_URL = "https://clist.by/api/v4/contest/";
const PAST_COUNT = 8;
const CACHE_TTL = 600;

const clistClient = axios.create({
    baseURL: CLIST_API_URL,
    timeout: 10000,
    params: {
        username: env.CLIST_USERNAME,
        api_key: env.CLIST_API_KEY,
    },
});

const fetchCodeforcesRaw = async () => {
    return cache.getOrSet("cf:raw", CACHE_TTL, async () => {
        const { data } = await axios.get("https://codeforces.com/api/contest.list", { timeout: 10000 });
        const contests = data.result || [];
        const upcomingContests = contests
            .filter((c) => c.phase === "BEFORE")
            .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
        const pastContests = contests
            .filter((c) => c.phase === "FINISHED")
            .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
            .slice(0, 5);
        return { upcomingContests, pastContests };
    });
};

const fetchClistRaw = async (host) => {
    return cache.getOrSet(`clist:${host}:raw`, CACHE_TTL, async () => {
        const now = new Date().toISOString();
        const [upRes, pastRes] = await Promise.all([
            clistClient.get("", { params: { host, start__gte: now, order_by: "start", limit: 50 } }),
            clistClient.get("", { params: { host, end__lt: now, order_by: "-end", limit: PAST_COUNT } }),
        ]);
        const upcomingContests = upRes.data.objects || [];
        const pastContests = pastRes.data.objects || [];
        if (!upcomingContests.length && !pastContests.length) {
            const logger = require("../lib/logger");
            logger.warn({ host }, "[clist] zero contests — check CLIST_API_KEY");
        }
        return { upcomingContests, pastContests };
    });
};

const settle = async (p) => {
    try {
        return { status: "fulfilled", value: await p };
    } catch (reason) {
        return { status: "rejected", reason };
    }
};

const fetchAllNormalized = async () => {
    return cache.getOrSet("all:normalized", CACHE_TTL, async () => {
        const cfPromise = settle(fetchCodeforcesRaw());
        const lc = await settle(fetchClistRaw("leetcode.com"));
        const cc = await settle(fetchClistRaw("codechef.com"));
        const ac = await settle(fetchClistRaw("atcoder.jp"));
        const cf = await cfPromise;

        const pick = (r) => (r.status === "fulfilled" ? r.value : { upcomingContests: [], pastContests: [] });

        const upcoming = [
            ...pick(cf).upcomingContests.map(normalizeCodeforces),
            ...pick(lc).upcomingContests.map(normalizeClist("leetcode")),
            ...pick(cc).upcomingContests.map(normalizeClist("codechef")),
            ...pick(ac).upcomingContests.map(normalizeClist("atcoder")),
        ].sort((a, b) => new Date(a.start) - new Date(b.start));

        const past = [
            ...pick(cf).pastContests.map(normalizeCodeforces),
            ...pick(lc).pastContests.map(normalizeClist("leetcode")),
            ...pick(cc).pastContests.map(normalizeClist("codechef")),
            ...pick(ac).pastContests.map(normalizeClist("atcoder")),
        ].sort((a, b) => new Date(b.end) - new Date(a.end));

        return {
            upcoming,
            past,
            errors: [cf, lc, cc, ac]
                .map((r, i) =>
                    r.status === "rejected"
                        ? { platform: ["codeforces", "leetcode", "codechef", "atcoder"][i], reason: r.reason?.message }
                        : null
                )
                .filter(Boolean),
        };
    });
};

module.exports = {
    fetchCodeforcesRaw,
    fetchClistRaw,
    fetchAllNormalized,
};
