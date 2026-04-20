import ContestCard from "./ContestCard";
import ContestCardSkeleton from "./ContestCardSkeleton";

export const ContestGrid = ({ contests, variant, loading, emptyLabel }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ContestCardSkeleton key={i} />
                ))}
            </div>
        );
    }
    if (!contests?.length) {
        return <p className="py-12 text-center text-gray-500 dark:text-gray-400">{emptyLabel}</p>;
    }
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contests.map((c) => (
                <ContestCard key={c.contestId} contest={c} variant={variant} />
            ))}
        </div>
    );
};

export default ContestGrid;
