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
import {useTheme} from "next-themes";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem(LOCAL_THEME_NAME));
    const htmlElement = document.documentElement;

    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Get/Set Dark Mode & Current Theme Variables
    useLayoutEffect(() => {
        if (typeof document !== 'undefined') {
            setIsDarkMode(htmlElement.classList.contains('dark'));
            // setSystemMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
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

            let color = ''

            if(isDarkMode) {
                color = themeColors.dark
            }else {
                if(systemMode && isDarkMode)  color = themeColors.dark
                if(systemMode && !systemMode)  color = themeColors.light
            }

            const metaTag = document.querySelector('meta[name="theme-color"]');
            if (metaTag) {
                metaTag.setAttribute('content', color);
            }
        }
    }, [isDarkMode, currentTheme, systemMode]);

    const values = {
        currentTheme,
        setCurrentTheme,
        darkMode: isDarkMode,
        setDarkMode: setIsDarkMode,
        systemMode
    };

    return (
        <AppContext.Provider value={values}>
            {children}
            <ToastContainer
                limit={1}
                autoClose={1000}
                position="top-center"
                pauseOnFocusLoss
                draggable
                theme={isDarkMode ? "dark" : "light"}
            />
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
