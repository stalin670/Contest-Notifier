const express = require("express");
const rateLimit = require("express-rate-limit");
const { publicKey, subscribe, unsubscribe } = require("../controllers/push.controller");
const { validate } = require("../middleware/validate");
const { subscribeSchema, unsubscribeSchema } = require("../schemas/push.schema");

const router = express.Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

router.get("/public-key", limiter, publicKey);
router.post("/subscribe", limiter, validate(subscribeSchema), subscribe);
router.post("/unsubscribe", limiter, validate(unsubscribeSchema), unsubscribe);

module.exports = router;
