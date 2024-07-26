"use server"

import {cookies} from "next/headers";
import {COOKIE_NAME_THEME, DEFAULT_THEME} from "@/lib/defaults";

export const getThemeCookie = async () => {
    return await cookies().get(COOKIE_NAME_THEME)?.value || DEFAULT_THEME
}