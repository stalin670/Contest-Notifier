import { useState } from "react";
import {
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    Youtube,
    Plus,
    Check,
    X,
    Loader2,
    CalendarPlus,
    Download,
} from "lucide-react";
import clsx from "clsx";
import { formatDate, formatDuration, formatRelativeTime } from "../utils/timeHelper";
import { useSolution, useAddSolution } from "../hooks/useContests";
import { usePrefsStore } from "../store/usePrefsStore";
import PlatformIcon from "./PlatformIcon";
import { platformMeta } from "../lib/platform";
import { downloadIcs, googleCalendarUrl } from "../lib/ics";

const ContestCard = ({ contest, variant }) => {
    const isPast = variant === "past";
    const { data: solutionLink, isLoading: solutionLoading } = useSolution(contest.contestId, isPast);
    const addMut = useAddSolution();
    const bookmarked = usePrefsStore((s) => s.isBookmarked(contest.contestId));
    const toggleBookmark = usePrefsStore((s) => s.toggleBookmark);
    const timezone = usePrefsStore((s) => s.timezone);

    const [showInput, setShowInput] = useState(false);
    const [link, setLink] = useState("");

    const meta = platformMeta(contest.platform);

    const submit = async () => {
        if (!link.trim()) return;
        try {
            await addMut.mutateAsync({
                contestId: contest.contestId,
                name: contest.name,
                platform: contest.platform,
                solutionLink: link.trim(),
            });
            setShowInput(false);
            setLink("");
        } catch {
            /* surfaced via mutation error state */
        }
    };

    return (
        <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <header className="flex items-center justify-between">
                <span
                    className={clsx(
                        "inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold",
                        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    )}
                >
                    <PlatformIcon platform={contest.platform} className="h-4 w-4" />
                    {meta.label}
                </span>
                <button
                    type="button"
                    onClick={() => toggleBookmark(contest)}
                    aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                    className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                    {bookmarked ? (
                        <BookmarkCheck className="h-5 w-5 text-blue-500" />
                    ) : (
                        <Bookmark className="h-5 w-5" />
                    )}
                </button>
            </header>

            <h2 className="mt-3 flex-grow text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
                <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                    <span>{contest.name}</span>
                    <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 opacity-60" />
                </a>
            </h2>

            <dl className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between gap-2">
                    <dt className="font-medium">Starts</dt>
                    <dd>{formatDate(contest.start, timezone)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                    <dt className="font-medium">Duration</dt>
                    <dd>{formatDuration(contest.durationSec)}</dd>
                </div>
            </dl>

            {!isPast && (
                <>
                    <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {formatRelativeTime(contest.start)}
                    </div>
                    <div className="mt-2 flex gap-2">
                        <a
                            href={googleCalendarUrl(contest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
                            aria-label="Add to Google Calendar"
                        >
                            <CalendarPlus className="h-3.5 w-3.5" /> Google
                        </a>
                        <button
                            type="button"
                            onClick={() => downloadIcs(contest)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
                            aria-label="Download ICS file"
                        >
                            <Download className="h-3.5 w-3.5" /> .ics
                        </button>
                    </div>
                </>
            )}

            {isPast && (
                <div className="mt-3">
                    {solutionLoading ? (
                        <div className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : solutionLink ? (
                        <a
                            href={solutionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                            <Youtube className="h-4 w-4" /> Watch Solution
                        </a>
                    ) : showInput ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="url"
                                autoFocus
                                placeholder="YouTube link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && submit()}
                                className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                            <button
                                type="button"
                                onClick={submit}
                                disabled={addMut.isPending}
                                aria-label="Save solution"
                                className="rounded-md bg-blue-500 p-1.5 text-white transition hover:bg-blue-600 disabled:opacity-50"
                            >
                                {addMut.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowInput(false);
                                    setLink("");
                                }}
                                aria-label="Cancel"
                                className="rounded-md bg-gray-200 p-1.5 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowInput(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500"
                        >
                            <Plus className="h-4 w-4" /> Add Solution Link
                        </button>
                    )}
                </div>
            )}
        </article>
    );
};

export default ContestCard;
