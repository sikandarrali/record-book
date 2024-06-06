export async function middleware(request) {
	await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay

	const currentUser = request.cookies.get("currentUser")?.value;

	if (currentUser && !request.nextUrl.pathname.startsWith("/")) {
		return Response.redirect(new URL("/", request.url));
	}

	if (!currentUser && !request.nextUrl.pathname.startsWith("/login")) {
		return Response.redirect(new URL("/login", request.url));
	}

	if (currentUser && request.nextUrl.pathname.startsWith("/login")) {
		return Response.redirect(new URL("/", request.url));
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
