"use server";
import { cookies } from "next/headers";

export async function addUserCookie(userName) {
	cookies().set("currentUser", userName);
}
export async function deleteUserCookie(data) {
	cookies().delete("currentUser");
}

export const getUserCookie = () => {
	const cookie = cookies().get("currentUser");
	return cookie;
};

export async function getSessionCookie() {
	return cookies().get("skrSession");
}
export async function createSessionCookie(cookieValue) {
	cookies().set("skrSession", cookieValue);
}

export async function createCookie(cookieName, cookieValue) {
	cookies().set(cookieName, cookieValue);
}

export async function deleteSessionCookie() {
	cookies().delete("skrSession");
}
