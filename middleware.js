import { createI18nMiddleware } from 'next-international/middleware'
import { ENDPOINT, PROJECT_ID } from "@/components/appwrite/appwrite";
import { DecodeUserId } from "@/lib/EncodeDecode";
import { NextResponse } from "next/server";
import { HOMEPAGE_ROUTE, LOCALE_NEUTRAL_ROUTES, LOCALE_PROTECTED_ROUTES, LOCALE_PUBLIC_ROUTES } from "@/lib/routes";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

const getCurrentUser = async (userSessionCookie) => {
    let response = null
    try {
        if (!userSessionCookie) {
            console.log('[mw] no session cookie present')
            return null
        }
        const userId = DecodeUserId(userSessionCookie.value)
        const url = `${ENDPOINT}/users/${userId}`
        const res = await fetch(url, {
            headers: {
                'X-Appwrite-Project': PROJECT_ID,
                'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
            },
        });
        if (!res.ok) {
            const body = await res.text()
            console.log('[mw] appwrite users.get failed', { url, status: res.status, body })
        }
        response = res.ok ? await res.json() : null;
    }
    catch (e) {
        console.log('[mw] getCurrentUser threw', e?.message)
        response = null
    }
    return response
}

export default async function middleware(request) {

    let userSessionCookie = request.cookies.get(process.env.NEXT_PUBLIC_USER_SESSION_COOKIE_NAME)

    const user = await getCurrentUser(userSessionCookie, request);
    const pathname = request.nextUrl.pathname;
    const isPublicPath = LOCALE_PUBLIC_ROUTES().includes(pathname);
    const isProtectedPath = LOCALE_PROTECTED_ROUTES().includes(pathname);
    const locale = user?.prefs?.lang || "en";

    console.log('[mw]', { pathname, hasCookie: !!userSessionCookie, hasUser: !!user, isPublicPath, isProtectedPath })

    if (user && isPublicPath) {
        return NextResponse.redirect(new URL(locale + HOMEPAGE_ROUTE, request.url))
    }

    if (!user && isProtectedPath) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const I18nMiddleware = createI18nMiddleware({
        locales: ['ur', 'en'],
        defaultLocale: "en",
        urlMappingStrategy: 'rewrite',
        resolveLocaleFromRequest: request => {
            return user?.prefs?.lang || 'en'
        }
    })

    return I18nMiddleware(request)
}

const otherConfig = ['/((?!api|_next|.*\\..*).*)'];
const matcher = otherConfig.concat(LOCALE_PROTECTED_ROUTES());

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
}