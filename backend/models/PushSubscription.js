const mongoose = require("mongoose");

const PushSubscriptionSchema = new mongoose.Schema(
    {
        endpoint: { type: String, required: true, unique: true, index: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true },
        },
        timezone: { type: String, default: "UTC" },
        notifiedContestIds: { type: [String], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PushSubscription", PushSubscriptionSchema);
