import React, { useState, useEffect } from 'react'
import { formatDate, formatDuration, formatRelativeTime } from "../utils/timeHelper.js"
import { Search } from 'lucide-react';
import axios from "axios";
import { MdAdd } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { MdOutlineComputer } from "react-icons/md";

const ContestCard = ({ contest, type, isBookmarked, toggleBookmark }) => {

    const [solutionLink, setSolutionLink] = useState(null);
    const [newLink, setNewLink] = useState("");
    const [showInput, setShowInput] = useState(false);

    // console.log(contest);

    // console.log("Inside the contest card", contest);

    useEffect(() => {
        if (type === "past") {
            fetchSolution();
        }
    }, []);

    const fetchSolution = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/contests/solution/${contest.id}`);
            setSolutionLink(response.data.solutionLink);
        } catch (error) {
            console.error("No solution found");
        }
    };

    const handleAddSolution = async () => {
        if (!newLink) return;
        try {
            // console.log("I'm here atleast")
            await axios.post("http://localhost:8000/api/contests/add-solution", {
                contestId: contest.id,
                name: contest.name,
                platform: contest.type === "CF" ? "Codeforces" : "Leetcode",
                solutionLink: newLink,
            });
            setSolutionLink(newLink);
            setShowInput(false);
        } catch (error) {
            console.error("Error adding solution link", error);
        }
    };

    const getPlatformIcon = (type) => {
        switch (type.toLowerCase()) {
            case "cf":
            case "icpc":
            case "codeforces":
                return <SiCodeforces className="inline-block mr-2" />;
            case "leetcode":
                return <SiLeetcode className="inline-block mr-2 text-yellow-400" />;
            case "atcoder":
                return <MdOutlineComputer className="inline-block mr-2 text-gray-500" />;
            default:
                return <SiCodechef className="inline-block mr-2 text-red-500" />;
        }
    };

    return (
        <div className="bg-white border border-gray-300 shadow-md rounded-2xl p-5 flex flex-col h-full dark:bg-black" >
            <div className="flex items-center">
                <span className="text-black border border-gray-300 text-sm font-semibold px-3 py-1 rounded-full dark:border-blue-500 dark:bg-blue-500 dark:text-black">
                    {getPlatformIcon(contest.type)}
                    {contest.type === "CF" || contest.type === "ICPC" || contest.type === "codeforces" ? "Codeforces" :
                        contest.type === "leetcode" ? "Leetcode" :
                            contest.type === "atcoder" ? "Atcoder" :
                                "Codechef"}
                </span>
                <button className="ml-auto text-gray-400 hover:text-black cursor-pointer" onClick={() => toggleBookmark(contest)}>
                    {isBookmarked ? <FaBookmark className="text-black" /> : <FaRegBookmark />}
                </button>
            </div>

            <h2 className="mt-3 text-lg font-semibold text-blue-600 flex-grow">
                {contest.name} <a href={
                    contest.type.toLowerCase() === "codeforces" || contest.type.toLowerCase() === "cf" || contest.type.toLowerCase() === "icpc"
                        ? `https://codeforces.com/contest/${contest.id}`
                        : contest.link
                } className="text-blue-400 cursor-pointer">🔗</a>
            </h2>

            <div className="mt-2 text-gray-600 text-sm dark:text-white">
                <p><strong>Starts:</strong> {formatDate(contest.startTimeSeconds)}</p>
                <p><strong>Duration:</strong> {formatDuration(contest.durationSeconds)}</p>
            </div>

            {type !== "past" && (
                <div className="mt-2 bg-gray-100 text-blue-600 font-medium p-2 rounded-lg flex items-center justify-center dark:bg-blue-500 dark:text-white">
                    Time: <span className="ml-1">{formatRelativeTime(contest.relativeTimeSeconds)}</span>
                </div>)}

            {type === "past" && (
                <div className={`mt-3 bg-gray-100 text-blue-600 font-medium p-2 rounded-lg flex items-center ${solutionLink ? 'bg-red-500' : 'bg-green-400'}`}>
                    {solutionLink ? (
                        <a href={solutionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center text-white">
                            <Search className="mr-2 cursor-pointer" /> Watch YouTube Solution
                        </a>
                    ) : (
                        <div>
                            {showInput ? (
                                <div className="flex w-full">
                                    <input
                                        type="text"
                                        className="p-1 border rounded-md flex-1 text-black"
                                        placeholder="Enter YouTube link"
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                    />
                                    <button onClick={handleAddSolution} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer">
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowInput(true)} className="flex items-center cursor-pointer text-black">
                                    <MdAdd className='cursor-pointer mr-2 size-7' /> Add Solution Link
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div >
    );
}

export default ContestCard



