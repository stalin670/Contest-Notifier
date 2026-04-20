import { Code2, Trophy, Swords, Terminal } from "lucide-react";

const MAP = {
    codeforces: { Icon: Code2, color: "text-red-500", label: "Codeforces" },
    leetcode: { Icon: Trophy, color: "text-yellow-500", label: "LeetCode" },
    atcoder: { Icon: Terminal, color: "text-sky-500", label: "AtCoder" },
    codechef: { Icon: Swords, color: "text-amber-700", label: "CodeChef" },
};

export const platformMeta = (platform) =>
    MAP[platform?.toLowerCase()] ?? { Icon: Code2, color: "text-gray-500", label: platform };
