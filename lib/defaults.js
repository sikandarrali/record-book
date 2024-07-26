"use client"

export const COOKIE_THEME_NAME = process.env.NEXT_PUBLIC_COOKIE_THEME_NAME
export const LOCAL_STORAGE_THEME_NAME_ITEM = process.env.NEXT_PUBLIC_LOCAL_STORAGE_THEME_NAME_ITEM
export const DEFAULT_THEME = "violet";
export const APP_THEME = DEFAULT_THEME

const defaultThemes = [
    {
        NAME: "default",
        VIEWPORT: "#F8F7FF",
        LOADER_GRADIENT: "linear-gradient(90deg, rgba(225,29,72,1) 0%, rgba(0,212,255,1) 100%)",
    }
]
// const APP_THEME = defaultThemes.find((theme)=> theme.NAME === USER_THEME_COOKIE);
//
// export { APP_THEME };