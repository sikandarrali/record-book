// import { NextResponse } from "next/server";
//
// const publicPaths = ["/login"];
// const protectedPaths = [
// 	"/",
// 	"/events",
// 	"/groups"
// ];
//
// export async function middleware(request) {
// 	const pathname = request.nextUrl.pathname;
// 	const isPublicPath = publicPaths.includes(pathname);
// 	const isProtectedPath = protectedPaths.includes(pathname);
//
// 	let sessionCookie = request.cookies.get("skrSession");
//
// 	if (sessionCookie && isPublicPath) {
// 		console.log('goto event')
// 		const redirectResponse = NextResponse.redirect(new URL("/events", request.url));
// 		redirectResponse.headers.set('x-middleware-cache', 'no-cache'); // ! FIX: Disable caching
// 		return redirectResponse;
// 	}
//
// 	if (!sessionCookie && isProtectedPath) {
// 		console.log('goto login')
// 		return NextResponse.redirect(new URL("/login", request.url));
// 	}
// }
//
// export const config = {
// 	matcher: [
// 		"/((?!api|_next/static|_next/image|favicon.ico).*)",
// 		"/",
// 		"/login",
// 		"/events",
// 		"/groups"
// 	]
// };


export async function middleware(request) {}