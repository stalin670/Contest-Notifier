import clsx from "clsx";
import { usePrefsStore, ALL_PLATFORMS } from "../store/usePrefsStore";
import { platformMeta } from "../lib/platform";

const PlatformFilter = () => {
    const visible = usePrefsStore((s) => s.visiblePlatforms);
    const toggle = usePrefsStore((s) => s.togglePlatform);

    return (
        <div className="flex flex-wrap justify-center gap-2 py-4">
            {ALL_PLATFORMS.map((p) => {
                const { Icon, label } = platformMeta(p);
                const active = visible.includes(p);
                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => toggle(p)}
                        aria-pressed={active}
                        className={clsx(
                            "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                            active
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default PlatformFilter;
