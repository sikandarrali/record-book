import { createI18nMiddleware } from 'next-international/middleware'
import {ENDPOINT, PROJECT_ID} from "@/components/appwrite/appwrite";
import {DecodeUserId} from "@/lib/EncodeDecode";
import {NextResponse} from "next/server";
import {HOMEPAGE_ROUTE, LOCALE_NEUTRAL_ROUTES, LOCALE_PROTECTED_ROUTES, LOCALE_PUBLIC_ROUTES} from "@/lib/routes";
import {cookies} from "next/headers";
import Cookies from "js-cookie";
const sdk = require('node-appwrite');

let client = new sdk.Client();
client
    .setEndpoint(ENDPOINT) // Your API Endpoint
    .setProject(PROJECT_ID) // Your project ID
    .setKey(process.env.APPWRITE_API_KEY) // Your secret API key
;
const users = new sdk.Users(client);

const getCurrentUser = async (userSessionCookie) =>{
    let response = null
    try {
        response = await users.get(DecodeUserId(userSessionCookie.value));
    }
    catch (e){
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
    const locale = user?.prefs?.lang || "ur";

    if (user && isPublicPath) {
        return NextResponse.redirect(new URL(locale + HOMEPAGE_ROUTE, request.url))
    }

    if (user && pathname==="/") {
        return NextResponse.redirect(new URL(locale + HOMEPAGE_ROUTE, request.url))
    }

    if (!user && isProtectedPath) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const I18nMiddleware = createI18nMiddleware({
        locales: ['ur', 'en'],
        defaultLocale: "ur" ,
        urlMappingStrategy: 'rewrite',
        resolveLocaleFromRequest: request => {
            return user?.prefs?.lang || 'ur'
        }
    })

    return I18nMiddleware(request)
}

const otherConfig = ['/((?!api|_next|.*\\..*).*)'];
const matcher = otherConfig.concat(LOCALE_PROTECTED_ROUTES());

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
}