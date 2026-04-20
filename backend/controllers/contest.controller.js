const Contest = require("../models/Contest.js");
const { asyncHandler } = require("../middleware/errorHandler.js");
const svc = require("../services/contest.service.js");

const codeforces = asyncHandler(async (req, res) => {
    res.status(200).json(await svc.fetchCodeforcesRaw());
});

const leetcode = asyncHandler(async (req, res) => {
    res.status(200).json(await svc.fetchClistRaw("leetcode.com"));
});

const codechef = asyncHandler(async (req, res) => {
    res.status(200).json(await svc.fetchClistRaw("codechef.com"));
});

const atcoder = asyncHandler(async (req, res) => {
    res.status(200).json(await svc.fetchClistRaw("atcoder.jp"));
});

const all = asyncHandler(async (req, res) => {
    res.status(200).json(await svc.fetchAllNormalized());
});

const addSolution = asyncHandler(async (req, res) => {
    const { contestId, name, platform, solutionLink } = req.body;
    const contest = await Contest.findOneAndUpdate(
        { contestId },
        { contestId, name, platform, solutionLink },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: "Solution link added/updated", contest });
});

const getSolution = asyncHandler(async (req, res) => {
    const contest = await Contest.findOne({ contestId: req.params.contestId });
    if (!contest) return res.status(404).json({ message: "No solution found" });
    res.json({ solutionLink: contest.solutionLink });
});

module.exports = { codeforces, leetcode, codechef, atcoder, all, addSolution, getSolution };
