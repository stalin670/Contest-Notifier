const webpush = require("web-push");
const logger = require("./logger");

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

let configured = false;
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_SUBJECT || "mailto:admin@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    configured = true;
    logger.info("[push] VAPID configured");
} else {
    logger.warn("[push] VAPID keys missing — push disabled. Run `npx web-push generate-vapid-keys`");
}

const send = async (subscription, payload) => {
    if (!configured) throw new Error("VAPID not configured");
    return webpush.sendNotification(subscription, JSON.stringify(payload));
};

module.exports = { send, isConfigured: () => configured, publicKey: VAPID_PUBLIC_KEY };
