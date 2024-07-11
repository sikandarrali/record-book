import { NextResponse } from "next/server";

const publicPaths = ["/login"];
const protectedPaths = [
	"/",
	"/login",
	"/events",
	"/event",
	"/groups"
];

export async function middleware(request) {
	const pathname = request.nextUrl.pathname;
	const isPublicPath = publicPaths.includes(pathname);
	const isProtectedPath = protectedPaths.includes(pathname);

	let sessionCookie = request.cookies.get("skrSession");

	if (sessionCookie && isPublicPath) {
		return NextResponse.rewrite(new URL("/events", request.url));
	}

	if (!sessionCookie && isProtectedPath) {
		return NextResponse.rewrite(new URL("/login", request.url));
	}
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
		"/",
		"/login",
		"/events",
		"/event",
		"/groups"
	]
};
