const axios = require('axios');
const Contest = require("../models/Contest.js");

// const API_URL = "https://clist.by/api/v4/contest/";
// const USERNAME = "Stalin67";
// const API_KEY = "f2dc27b90fe74f6de0fdd0873c7f1623b76f18e2";
// const platform = "leetcode.com";

const codeforces = async (req, res) => {
    try {
        const now = Math.floor(Date.now() / 1000);

        const response = await axios.get('https://codeforces.com/api/contest.list');

        const contests = response.data.result;
        // console.log(contests);


        const upcomingContests = contests
            .filter(contest => contest.phase === "BEFORE")
            .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
        const pastContests = contests
            .filter(contest => contest.phase === "FINISHED")
            .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
            .slice(0, 5);

        return res.status(200).json({ upcomingContests, pastContests });
    } catch (error) {
        console.error("Error fetching contests:", error.response?.data || error.message);
        return res.status(500).json({ error: 'Error fetching contests.' });
    }
};

const addSolution = async (req, res) => {
    const { contestId, name, platform, solutionLink } = req.body;

    try {
        console.log("Hey");
        let contest = await Contest.findOne({ contestId });
        if (contest) {
            contest.solutionLink = solutionLink;
            await contest.save();
        } else {
            contest = new Contest({ contestId, name, platform, solutionLink });
            await contest.save();
        }

        res.status(200).json({ message: "Solution link added/updated", contest });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getSolution = async (req, res) => {
    try {
        const contest = await Contest.findOne({ contestId: req.params.contestId });
        if (contest) {
            res.json({ solutionLink: contest.solutionLink });
        } else {
            res.status(404).json({ message: "No solution found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    codeforces,
    getSolution,
    addSolution
};
