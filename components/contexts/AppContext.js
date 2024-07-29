"use client"
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { LOCAL_THEME_NAME, DEFAULT_THEME } from "@/lib/defaults";
import { GetCurrentThemeBackgroundColor } from "@/lib/utils";
import { ToastContainer } from "react-toastify";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
    const htmlElement = document.documentElement;

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setIsDarkMode(htmlElement.classList.contains('dark'));
            setCurrentTheme(localStorage.getItem(LOCAL_THEME_NAME) || DEFAULT_THEME);
        }
    }, []);

    // Set Theme
    useLayoutEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.classList.add(currentTheme);
            localStorage.setItem(LOCAL_THEME_NAME, currentTheme || 'theme-violet');
        }
    }, [currentTheme]);

    // Set Viewport Color
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            const color = isDarkMode ? GetCurrentThemeBackgroundColor(currentTheme, true) : GetCurrentThemeBackgroundColor(currentTheme, false);
            const metaTag = document.querySelector('meta[name="theme-color"]');
            if (metaTag) {
                metaTag.setAttribute('content', color);
            }
        }
    }, [isDarkMode, currentTheme]);

    const values = {
        currentTheme,
        setCurrentTheme,
        darkMode: isDarkMode,
        setDarkMode: setIsDarkMode
    };

    return (
        <AppContext.Provider value={values}>
            {children}
            <ToastContainer
                limit={1}
                autoClose={15000000}
                position="top-center"
                pauseOnFocusLoss
                draggable={'touch'}
                theme={isDarkMode ? "dark" : "light"}
            />
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
