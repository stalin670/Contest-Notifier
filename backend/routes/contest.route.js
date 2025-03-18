const express = require("express");
const router = express.Router();
const { codeforces } = require("../controllers/contest.controller.js");

router.get("/codeforces", codeforces);

module.exports = router;