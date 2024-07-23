import {SupportedLanguages} from "@/lib/defaultData";

export const HOMEPAGE_ROUTE = "/events";
export const LOGIN_ROUTE = "/login";
export const PROTECTED_ROUTES = ""

const allPublicPaths = [
    "/login",
    "/terms-of-service",
    "/privacy-policy",
    "/join-group"
]
const allProtectedPaths = [
    "/",
    "/events",
    "/event",
    "/groups",
    "/logout"
]

export const LOCALE_PUBLIC_ROUTES = () =>{
    const paths = [];

    allPublicPaths.forEach((path) => {
        paths.push(path);
    });
    SupportedLanguages.forEach((lang) => {
        allPublicPaths.forEach((path) => {
            paths.push(`/${lang.value}${path}`);
        });
    });

    return paths
};

export const LOCALE_PROTECTED_ROUTES = () =>{
    const paths = [];

    allProtectedPaths.forEach((path) => {
        paths.push(path);
    });
    SupportedLanguages.forEach((lang) => {
        allProtectedPaths.forEach((path) => {
            paths.push(`/${lang.value}${path}`);
        });
    });

    return paths
};

