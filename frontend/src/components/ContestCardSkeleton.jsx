const ContestCardSkeleton = () => (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
            <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="mt-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-2 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-4 h-9 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
    </div>
);

export default ContestCardSkeleton;
