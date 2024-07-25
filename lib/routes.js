import {SupportedLanguages} from "@/lib/defaultData";

export const HOMEPAGE_ROUTE = "/";
export const LOGIN_ROUTE = "/login";

const allPublicPaths = [
    "/login",
    "/terms-of-service",
    "/privacy-policy",
    "/join-group",
    "/dev"
]
const allProtectedPaths = [
    "/",
    "/page",
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

