const axios = require('axios');

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

module.exports = {
    codeforces
};
