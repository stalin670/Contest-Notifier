const PushSubscription = require("../models/PushSubscription");
const { asyncHandler } = require("../middleware/errorHandler");
const push = require("../lib/push");

const publicKey = asyncHandler(async (req, res) => {
    res.json({ publicKey: push.publicKey || null, enabled: push.isConfigured() });
});

const subscribe = asyncHandler(async (req, res) => {
    const { endpoint, keys, timezone } = req.body;
    await PushSubscription.findOneAndUpdate(
        { endpoint },
        { endpoint, keys, timezone: timezone || "UTC" },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ ok: true });
});

const unsubscribe = asyncHandler(async (req, res) => {
    const { endpoint } = req.body;
    await PushSubscription.deleteOne({ endpoint });
    res.json({ ok: true });
});

module.exports = { publicKey, subscribe, unsubscribe };
