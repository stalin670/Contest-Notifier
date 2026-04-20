import { useEffect } from "react";
import { usePrefsStore } from "../store/usePrefsStore";

export const useThemeSync = () => {
    const theme = usePrefsStore((s) => s.theme);
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        root.dataset.theme = theme;
    }, [theme]);
};
