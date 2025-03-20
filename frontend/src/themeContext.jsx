import React, { useEffect, createContext, useState } from "react";

const ThemeContext = createContext();

const getTheme = () => {
    const theme = localStorage.getItem("theme");
    if (!theme) {
        localStorage.setItem("theme", "dark-theme");
        return "dark-theme";
    } else {
        return theme;
    }
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getTheme);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark-theme" ? "light-theme" : "dark-theme"));
    };

    useEffect(() => {
        document.documentElement.classList.remove("light-theme", "dark-theme");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };
