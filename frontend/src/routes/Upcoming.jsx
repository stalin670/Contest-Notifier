import { useMemo } from "react";
import { useContests } from "../hooks/useContests";
import { usePrefsStore } from "../store/usePrefsStore";
import ContestGrid from "../components/ContestGrid";

const Upcoming = () => {
    const { data, isLoading, isError, error } = useContests();
    const visible = usePrefsStore((s) => s.visiblePlatforms);
    const q = usePrefsStore((s) => s.searchQuery)
        .trim()
        .toLowerCase();

    const contests = useMemo(
        () =>
            (data?.upcoming ?? [])
                .filter((c) => visible.includes(c.platform))
                .filter((c) => !q || c.name.toLowerCase().includes(q)),
        [data, visible, q]
    );

    if (isError) throw error;
    return (
        <ContestGrid contests={contests} variant="upcoming" loading={isLoading} emptyLabel="No upcoming contests." />
    );
};

export default Upcoming;
