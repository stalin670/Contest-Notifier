const express = require("express");
const rateLimit = require("express-rate-limit");
const {
    codeforces,
    getSolution,
    addSolution,
    leetcode,
    codechef,
    atcoder,
    all,
} = require("../controllers/contest.controller.js");
const { validate } = require("../middleware/validate.js");
const { addSolutionSchema } = require("../schemas/contest.schema.js");

const router = express.Router();

const readLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get("/all", readLimiter, all);
router.get("/codeforces", readLimiter, codeforces);
router.get("/leetcode", readLimiter, leetcode);
router.get("/codechef", readLimiter, codechef);
router.get("/atcoder", readLimiter, atcoder);
router.get("/solution/:contestId", readLimiter, getSolution);

router.post("/add-solution", writeLimiter, validate(addSolutionSchema), addSolution);

module.exports = router;
