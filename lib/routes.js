import {SupportedLanguages} from "@/lib/defaultData";

export const HOMEPAGE_ROUTE = "/";
export const LOGIN_ROUTE = "/login";

export const LOCALE_HOME_ROUTE = [
    "/", "/en", "/ur"
]
const allPublicPaths = [
    "/login"
]
const allProtectedPaths = [
    "/",
    "/page",
    "/groups",
    "/logout",
    "/settings"
]
const neutralPaths = [
    "/terms-of-service",
    "/privacy-policy",
    "/join-group",
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

export const LOCALE_NEUTRAL_ROUTES = () =>{
    const paths = [];

    neutralPaths.forEach((path) => {
        paths.push(path);
    });
    SupportedLanguages.forEach((lang) => {
        neutralPaths.forEach((path) => {
            paths.push(`/${lang.value}${path}`);
        });
    });

    return paths
};

