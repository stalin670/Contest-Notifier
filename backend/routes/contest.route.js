const express = require("express");
const router = express.Router();
const { codeforces, getSolution, addSolution, leetcode, codechef, atcoder } = require("../controllers/contest.controller.js");

router.get("/codeforces", codeforces);
router.get("/leetcode", leetcode);
router.get("/codechef", codechef);
router.get("/atcoder", atcoder);

router.post("/add-solution", addSolution);
router.get("/solution/:contestId", getSolution);

module.exports = router;