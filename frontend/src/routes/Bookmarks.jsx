import { usePrefsStore } from "../store/usePrefsStore";
import ContestGrid from "../components/ContestGrid";

const Bookmarks = () => {
    const bookmarks = usePrefsStore((s) => s.bookmarks);
    return (
        <ContestGrid contests={bookmarks} variant="upcoming" loading={false} emptyLabel="No bookmarked contests yet." />
    );
};

export default Bookmarks;
