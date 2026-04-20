const { z } = require("zod");

const subscribeSchema = z.object({
    endpoint: z.string().url().max(2048),
    keys: z.object({
        p256dh: z.string().min(1).max(200),
        auth: z.string().min(1).max(200),
    }),
    timezone: z.string().max(100).optional(),
});

const unsubscribeSchema = z.object({
    endpoint: z.string().url().max(2048),
});

module.exports = { subscribeSchema, unsubscribeSchema };
