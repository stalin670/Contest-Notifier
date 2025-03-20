import React, { useEffect, useState } from 'react';
import ContestCard from './ContestCard';
import axios from "axios";

const Main = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [upcomingContests, setUpcomingContests] = useState([]);
    const [pastContests, setPastContests] = useState([]);
    const [bookmarkedContests, setBookmarkedContests] = useState(() => {
        return JSON.parse(localStorage.getItem("bookmarkedContests")) || [];
    });
    const [filteredContests, setFilteredContests] = useState({ upcoming: [], past: [] })
    const [visibleContests, setVisibleContests] = useState(() => {
        return JSON.parse(localStorage.getItem("visibleContests")) || ["codeforces", "leetcode", "atcoder", "codechef"];
    });

    useEffect(() => {
        const storedPlatforms = JSON.parse(localStorage.getItem("visibleContests")) || ["codeforces", "leetcode", "atcoder", "codechef"];
        setVisibleContests(storedPlatforms);
    }, []);

    useEffect(() => {
        localStorage.setItem("bookmarkedContests", JSON.stringify(bookmarkedContests));
    }, [bookmarkedContests]);

    useEffect(() => {
        localStorage.setItem("visibleContests", JSON.stringify(visibleContests));

        const filteredUpcoming = Array.isArray(upcomingContests)
            ? upcomingContests
                .filter(contest => visibleContests.includes(contest.type))
                .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
            : [];
        const filteredPast = Array.isArray(pastContests)
            ? pastContests
                .filter(contest => visibleContests.includes(contest.type))
                .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
            : [];

        setFilteredContests({ upcoming: filteredUpcoming, past: filteredPast });

        console.log(filteredContests.upcoming);
    }, [visibleContests, upcomingContests, pastContests]);

    const fetchContests = async (platform) => {
        try {
            const response = await axios.get(`https://contest-notifier-xg6a.onrender.com/api/contests/${platform}`);
            const contestData = response.data;

            console.log(contestData);

            const mapContestData = (contest) => ({
                id: contest.id,
                name: contest.name || contest.event,
                link: contest.href || `https://codeforces.com/contest/${contest.id}`,
                type: platform,
                startTimeSeconds: contest.startTimeSeconds || Math.floor(new Date(contest.start).getTime() / 1000),
                durationSeconds: contest.durationSeconds || contest.duration,
                relativeTimeSeconds: contest.relativeTimeSeconds || Math.floor(new Date(contest.start).getTime() / 1000) - Math.floor(Date.now() / 1000),
            });

            setUpcomingContests((prev) => {
                const merged = [...prev, ...(contestData.upcomingContests || []).map(mapContestData)];
                return Array.from(new Map(merged.map(contest => [contest.id, contest])).values());
            });

            setPastContests((prev) => {
                const merged = [...prev, ...(contestData.pastContests || []).map(mapContestData)];
                return Array.from(new Map(merged.map(contest => [contest.id, contest])).values());
            });
        } catch (error) {
            console.error(`Error fetching ${platform} contests:`, error);
        }
    };

    useEffect(() => {
        const platforms = ["codeforces", "leetcode", "atcoder", "codechef"];
        platforms.forEach(fetchContests);
    }, []);

    const handleClick = (platform) => {
        setVisibleContests(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const toggleBookmark = (contest) => {
        setBookmarkedContests((prev) => {
            const isBookmarked = prev.some((c) => c.id === contest.id);
            if (isBookmarked) {
                return prev.filter((c) => c.id !== contest.id);
            } else {
                return [...prev, contest];
            }
        });
    };

    return (
        <div className="dark:bg-black pb-5">
            <div className="text-white text-center p-4 mx-auto">
                {["codeforces", "leetcode", "atcoder", "codechef"].map(platform => (
                    <button
                        key={platform}
                        className={`mx-1 btn ${visibleContests?.includes(platform) ? 'bg-blue-500 text-white dark:border-grey dark:border-2 dark:border-solid' : 'btn-outline border-gray-300 text-gray-500 dark:text-white dark:border-grey dark:border-2 dark:border-solid'} hover:bg-gray-200 dark:hover:text-blue-500 rounded-full`}
                        onClick={() => handleClick(platform)}
                    >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                ))}
            </div>

            <div className="tabs tabs-lifted sm:mx-5 md:mx-10 lg:mx-10 p-2 ">
                <button
                    className={`tab mx-2 py-2 px-4 font-bold rounded-full 
            ${activeTab === 1 ?
                            '!bg-gray-300 !border-2 !border-black dark:!bg-blue-500 dark:!text-white dark:!border-white'
                            : 'dark:!bg-black dark:!border-white dark:!text-white dark:hover:!text-blue-500 dark:hover:!bg-gray-200 border-2 border-black'}`}
                    onClick={() => setActiveTab(1)}
                >
                    Upcoming
                </button>
                <button
                    className={`tab mx-2 py-2 px-4 font-bold rounded-full 
            ${activeTab === 2 ?
                            '!bg-gray-300 !text-white dark:!bg-blue-500 dark:!text-white'
                            : 'dark:!bg-black dark:!border-white dark:!text-white hover:!bg-gray-300 !border-2 !border-black'}`}
                    onClick={() => setActiveTab(2)}
                >
                    Recent
                </button>
                <button
                    className={`tab mx-2 py-2 px-4 font-bold rounded-full 
            ${activeTab === 3 ?
                            '!bg-gray-300 !text-white dark:!bg-blue-500 dark:!text-white'
                            : 'dark:!bg-black dark:!border-white dark:!text-white hover:!bg-gray-300 !border-2 !border-black'}`}
                    onClick={() => setActiveTab(3)}
                >
                    Bookmarked
                </button>
            </div>


            <div className="">
                {activeTab === 1 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:px-5 md:px-10 lg:px-10">
                        {filteredContests?.upcoming?.map((contest) => (
                            <ContestCard
                                key={contest.id}
                                contest={contest}
                                type="upcoming"
                                isBookmarked={bookmarkedContests.some((c) => c.id === contest.id)}
                                toggleBookmark={toggleBookmark}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:px-5 md:px-10 lg:px-10">
                        {filteredContests?.past?.map((contest) => (
                            <ContestCard
                                key={contest.id}
                                contest={contest}
                                type="past"
                                isBookmarked={bookmarkedContests.some((c) => c.id === contest.id)}
                                toggleBookmark={toggleBookmark}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 3 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:px-5 md:px-10 lg:px-10">
                        {bookmarkedContests.length === 0 ? (
                            <p className="text-white">No bookmarked contests.</p>
                        ) : (
                            bookmarkedContests?.map((contest) => (
                                <ContestCard
                                    key={contest.id}
                                    contest={contest}
                                    type="bookmarked"
                                    isBookmarked={true}
                                    toggleBookmark={toggleBookmark}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;
