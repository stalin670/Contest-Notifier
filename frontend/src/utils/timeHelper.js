import { formatInTimeZone } from "date-fns-tz";
import { formatDistanceStrict, intervalToDuration } from "date-fns";

export const formatDate = (iso, tz) => {
    try {
        return formatInTimeZone(new Date(iso), tz || "UTC", "EEE, MMM d, h:mm a zzz");
    } catch {
        return "—";
    }
};

export const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const d = intervalToDuration({ start: 0, end: seconds * 1000 });
    const parts = [];
    if (d.days) parts.push(`${d.days}d`);
    if (d.hours) parts.push(`${d.hours}h`);
    if (d.minutes) parts.push(`${d.minutes}m`);
    return parts.join(" ") || "0m";
};

export const formatRelativeTime = (iso) => {
    try {
        const diff = new Date(iso) - new Date();
        if (diff <= 0) return "started";
        return `in ${formatDistanceStrict(new Date(iso), new Date())}`;
    } catch {
        return "—";
    }
};
