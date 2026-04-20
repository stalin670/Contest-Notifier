const normalizeCodeforces = (c) => ({
    contestId: `codeforces-${c.id}`,
    platform: "codeforces",
    name: c.name,
    url: `https://codeforces.com/contest/${c.id}`,
    start: new Date(c.startTimeSeconds * 1000).toISOString(),
    end: new Date((c.startTimeSeconds + c.durationSeconds) * 1000).toISOString(),
    durationSec: c.durationSeconds,
});

const normalizeClist = (platform) => (c) => ({
    contestId: `${platform}-${c.id}`,
    platform,
    name: c.event,
    url: c.href,
    start: c.start,
    end: c.end,
    durationSec: c.duration,
});

module.exports = { normalizeCodeforces, normalizeClist };
