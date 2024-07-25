import Cookies from "js-cookie";

export const USER_THEME_COOKIE = Cookies.get(process.env.NEXT_PUBLIC_USER_THEME_COOKIE)?.value || "default"

const defaultThemes = [
    {
        NAME: "default",
        VIEWPORT: "#F8F7FF",
        LOADER_GRADIENT: "linear-gradient(90deg, rgba(225,29,72,1) 0%, rgba(0,212,255,1) 100%)",
    }
]
const APP_THEME = defaultThemes.find((theme)=> theme.NAME === USER_THEME_COOKIE);

export { APP_THEME };