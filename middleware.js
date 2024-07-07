import { NextResponse } from "next/server";

const publicPaths = ["/login"];

export async function middleware(request) {
	// await new Promise((resolve) => setTimeout(resolve, 10)); // Short delay

	const pathname = request.nextUrl.pathname;
	const isPublicPath = publicPaths.includes(pathname);
	// const user = getLoggedInUser();

	let sessionCookie = request.cookies.get("skrSession");

	// if (user) console.log("user found");
	// else console.log("user not found");

	// console.log("user: ", getLoggedInUser());

	if (sessionCookie && isPublicPath) {
		return NextResponse.redirect(new URL("/events", request.url));
	}

	if (!sessionCookie && !isPublicPath) {
		return NextResponse.redirect(new URL("/login", request.url));
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
	],
};
