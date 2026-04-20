export type Platform = "codeforces" | "leetcode" | "codechef" | "atcoder";

export interface Contest {
    contestId: string;
    platform: Platform;
    name: string;
    url: string;
    start: string;
    end: string;
    durationSec: number;
}

export interface ContestsResponse {
    upcoming: Contest[];
    past: Contest[];
    errors: { platform: Platform; reason: string }[];
}
