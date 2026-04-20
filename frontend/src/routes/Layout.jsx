import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import PlatformFilter from "../components/PlatformFilter";
import ErrorFallback from "../components/ErrorFallback";
import ContestCardSkeleton from "../components/ContestCardSkeleton";
import SearchBar from "../components/SearchBar";
import TimezoneSelect from "../components/TimezoneSelect";
import PushButton from "../components/PushButton";
import ErrorsBanner from "../components/ErrorsBanner";
import { useThemeSync } from "../hooks/useThemeSync";
import { FaGithub, FaLinkedin, FaTwitter } from "../components/SocialIcons";

const GridFallback = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
            <ContestCardSkeleton key={i} />
        ))}
    </div>
);

const Layout = () => {
    useThemeSync();
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-stretch gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <SearchBar />
                    <div className="flex flex-wrap items-center gap-2">
                        <TimezoneSelect />
                        <PushButton />
                    </div>
                </div>
                <PlatformFilter />
                <ErrorsBanner />
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<GridFallback />}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </main>
            <footer className="mt-8 border-t border-gray-200 py-6 dark:border-gray-800">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} Contest Notifier</p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://linkedin.com/in/stalin67"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-blue-500"
                        >
                            <FaLinkedin className="h-4 w-4" /> Amit Yadav
                        </a>
                        <a
                            href="https://twitter.com/stalin670"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-blue-500"
                        >
                            <FaTwitter className="h-4 w-4" /> @stalin670
                        </a>
                        <a
                            href="https://github.com/stalin67"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-blue-500"
                        >
                            <FaGithub className="h-4 w-4" /> GitHub
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
