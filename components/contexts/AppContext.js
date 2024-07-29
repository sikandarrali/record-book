"use client"
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import {
    LOCAL_THEME_NAME,
    DEFAULT_THEME,
    DEFAULT_VIEWPORT_COLOR_LIGHT,
    DEFAULT_VIEWPORT_COLOR_DARK
} from "@/lib/defaults";
import {GetCurrentTheme} from "@/lib/utils";
import { ToastContainer } from "react-toastify";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem(LOCAL_THEME_NAME));
    const htmlElement = document.documentElement;

    // Get/Set Dark Mode & Current Theme Variables
    useLayoutEffect(() => {
        if (typeof document !== 'undefined') {
            setIsDarkMode(htmlElement.classList.contains('dark'));
            // setCurrentTheme(localStorage.getItem(LOCAL_THEME_NAME));
        }
    }, []);

    // Set Theme
    useLayoutEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.classList.add(GetCurrentTheme(currentTheme).name);
            localStorage.setItem(LOCAL_THEME_NAME, GetCurrentTheme(currentTheme).name);
        }

    }, [currentTheme]);

    // Set Viewport Color
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            const themeColors = GetCurrentTheme(currentTheme).colors;
            const color = isDarkMode ? themeColors.dark || DEFAULT_VIEWPORT_COLOR_DARK: themeColors.light || DEFAULT_VIEWPORT_COLOR_LIGHT;
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
                autoClose={1000}
                position="top-center"
                pauseOnFocusLoss
                draggable={'touch'}
                theme={isDarkMode ? "dark" : "light"}
            />
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
