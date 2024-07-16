import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
    locales: ["ur", "en"],
    defaultLocale: "ur",
    urlMappingStrategy: "rewrite",

    resolveLocaleFromRequest: () => {
        // this bypasses Accept-Language header from Browser setting
        return "ur";
    },
});

export function middleware(request) {
    return I18nMiddleware(request);
}
export const config = {
    matcher: [
        '/',
        '/events',
        '/groups',
        '/join-group',
        '/login',
        '/logout',
        '/(ur|en)/:path*',
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};