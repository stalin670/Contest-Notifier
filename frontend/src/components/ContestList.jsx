import React, { useEffect, useState } from 'react';
import { getCodeforcesContests } from '../services/contestService';

const ContestList = () => {
    const [upcomingContests, setUpcomingContests] = useState([]);
    const [pastContests, setPastContests] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('codeforces');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCodeforcesContests();
            setUpcomingContests(data.upcomingContests);
            setPastContests(data.pastContests);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Contest Tracker</h1>

            <label>Filter by Platform:</label>
            <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                <option value="codeforces">Codeforces</option>
                {/* Future Options:
                <option value="leetcode">LeetCode</option>
                <option value="atcoder">AtCoder</option> */}
            </select>
            <h2>Upcoming {selectedPlatform} Contests</h2>
            <ul>
                {upcomingContests.map(contest => (
                    <li key={contest.id}>
                        {contest.name} - Starts in: {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                    </li>
                ))}
            </ul>

            <h2>Recent Past {selectedPlatform} Contests</h2>
            <ul>
                {pastContests.map(contest => (
                    <li key={contest.id}>
                        {contest.name} - Ended on: {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div >
    );
};

export default ContestList;
