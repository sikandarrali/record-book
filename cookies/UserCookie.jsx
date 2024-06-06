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
