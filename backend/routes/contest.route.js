const express = require("express");
const router = express.Router();
const { codeforces, getSolution, addSolution } = require("../controllers/contest.controller.js");

router.get("/codeforces", codeforces);

router.post("/add-solution", addSolution);
router.get("/solution/:contestId", getSolution);

module.exports = router;