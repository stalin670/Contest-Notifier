import { NavLink } from "react-router-dom";
import { Sun, Moon, Trophy } from "lucide-react";
import clsx from "clsx";
import { usePrefsStore } from "../store/usePrefsStore";

const tabs = [
    { to: "/", label: "Upcoming", end: true },
    { to: "/past", label: "Recent" },
    { to: "/bookmarks", label: "Bookmarks" },
];

const Navbar = () => {
    const theme = usePrefsStore((s) => s.theme);
    const toggleTheme = usePrefsStore((s) => s.toggleTheme);

    return (
        <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contest Notifier</span>
                </div>

                <div className="hidden gap-1 sm:flex">
                    {tabs.map((t) => (
                        <NavLink
                            key={t.to}
                            to={t.to}
                            end={t.end}
                            className={({ isActive }) =>
                                clsx(
                                    "rounded-full px-4 py-1.5 text-sm font-medium transition",
                                    isActive
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                )
                            }
                        >
                            {t.label}
                        </NavLink>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>

            <div className="flex gap-1 overflow-x-auto border-t border-gray-200 px-4 py-2 sm:hidden dark:border-gray-800">
                {tabs.map((t) => (
                    <NavLink
                        key={t.to}
                        to={t.to}
                        end={t.end}
                        className={({ isActive }) =>
                            clsx(
                                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium",
                                isActive ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"
                            )
                        }
                    >
                        {t.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
