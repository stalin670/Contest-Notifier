import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { usePrefsStore } from "../store/usePrefsStore";

const SearchBar = () => {
    const setQuery = usePrefsStore((s) => s.setSearchQuery);
    const query = usePrefsStore((s) => s.searchQuery);
    const [local, setLocal] = useState(query);

    useEffect(() => {
        const t = setTimeout(() => setQuery(local), 200);
        return () => clearTimeout(t);
    }, [local, setQuery]);

    return (
        <div className="relative w-full max-w-sm">
            <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
            />
            <input
                type="search"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Search contests..."
                className="w-full rounded-full border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-900/40"
                aria-label="Search contests"
            />
            {local && (
                <button
                    type="button"
                    onClick={() => setLocal("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
