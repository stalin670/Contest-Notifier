import { Globe } from "lucide-react";
import { usePrefsStore } from "../store/usePrefsStore";

const zones =
    typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("timeZone")
        : ["UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];

const TimezoneSelect = () => {
    const tz = usePrefsStore((s) => s.timezone);
    const setTz = usePrefsStore((s) => s.setTimezone);
    return (
        <label className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <Globe className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span className="sr-only">Timezone</span>
            <select
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                className="bg-transparent text-sm focus:outline-none"
                aria-label="Timezone"
            >
                {zones.map((z) => (
                    <option key={z} value={z}>
                        {z}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default TimezoneSelect;
