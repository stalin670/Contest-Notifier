const PushSubscription = require("../models/PushSubscription");
const logger = require("../lib/logger");
const push = require("../lib/push");
const svc = require("./contest.service");

const NOTIFY_WINDOW_MS = 60 * 60 * 1000;

const dispatchUpcomingReminders = async () => {
    if (!push.isConfigured()) return { skipped: true };

    const subs = await PushSubscription.find({}).lean();
    if (!subs.length) return { sent: 0 };

    const { upcoming } = await svc.fetchAllNormalized();
    const now = Date.now();
    const soon = upcoming.filter((c) => {
        const t = new Date(c.start).getTime();
        return t > now && t - now <= NOTIFY_WINDOW_MS;
    });
    if (!soon.length) return { sent: 0 };

    let sent = 0;
    let removed = 0;

    for (const sub of subs) {
        const toNotify = soon.filter((c) => !sub.notifiedContestIds.includes(c.contestId));
        for (const c of toNotify) {
            try {
                await push.send(
                    { endpoint: sub.endpoint, keys: sub.keys },
                    {
                        title: `${c.name} starts soon`,
                        body: `${c.platform} · ${new Date(c.start).toLocaleString()}`,
                        url: c.url,
                        contestId: c.contestId,
                    }
                );
                sent++;
                await PushSubscription.updateOne(
                    { endpoint: sub.endpoint },
                    { $addToSet: { notifiedContestIds: c.contestId } }
                );
            } catch (err) {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    await PushSubscription.deleteOne({ endpoint: sub.endpoint });
                    removed++;
                    break;
                }
                logger.error({ err: err.message, endpoint: sub.endpoint }, "[push] send failed");
            }
        }
    }

    logger.info({ sent, removed }, "[push] reminders dispatched");
    return { sent, removed };
};

module.exports = { dispatchUpcomingReminders };
