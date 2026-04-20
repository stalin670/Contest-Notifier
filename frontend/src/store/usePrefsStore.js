import { create } from "zustand";
import { persist } from "zustand/middleware";

const ALL_PLATFORMS = ["codeforces", "leetcode", "atcoder", "codechef"];

const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("prefs-store");
    if (stored) {
        try {
            return JSON.parse(stored).state?.theme ?? "light";
        } catch {
            return "light";
        }
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const usePrefsStore = create(
    persist(
        (set, get) => ({
            theme: getInitialTheme(),
            visiblePlatforms: ALL_PLATFORMS,
            bookmarks: [],
            timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
            searchQuery: "",

            setTimezone: (timezone) => set({ timezone }),
            setSearchQuery: (searchQuery) => set({ searchQuery }),

            toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
            setTheme: (theme) => set({ theme }),

            togglePlatform: (p) =>
                set({
                    visiblePlatforms: get().visiblePlatforms.includes(p)
                        ? get().visiblePlatforms.filter((x) => x !== p)
                        : [...get().visiblePlatforms, p],
                }),

            toggleBookmark: (contest) => {
                const exists = get().bookmarks.some((c) => c.contestId === contest.contestId);
                set({
                    bookmarks: exists
                        ? get().bookmarks.filter((c) => c.contestId !== contest.contestId)
                        : [...get().bookmarks, contest],
                });
            },
            isBookmarked: (contestId) => get().bookmarks.some((c) => c.contestId === contestId),
        }),
        { name: "prefs-store" }
    )
);

export { ALL_PLATFORMS };
