// src/lib/server/appwrite.js
"use server";
import { Account, Client } from "appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
		.setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

	const session = cookies().get("my-custom-session");
	if (!session || !session.value) {
		throw new Error("No session");
	}

	client.setSession(session.value);

	return {
		get account() {
			return new Account(client);
		},
	};
}
