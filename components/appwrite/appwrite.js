import {Account, Client, Databases, Query} from "appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID_EVENTS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS;
const COLLECTION_ID_EVENT_ITEMS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { ID } from "appwrite";

const login = async () => {
	account.createOAuth2Session(
		"google",
		process.env.NEXT_PUBLIC_CALLBACK_AFTER_LOGIN,
		process.env.NEXT_PUBLIC_CALLBACK_AFTER_LOGIN_FAILED
	);
};

const logout = async () => {
	try {
		return account.deleteSession("current");
	} catch (error) {
		console.error(error);
	}
};

const getCurrentUser = async () => {
	try {
		return account.get();
	} catch (error) {
		console.log(error);
	}
};

const getCurrentSession = async () => {
	try {
		return account.getSession("current");
	} catch (error) {
		console.log(error);
	}
};

const refreshCurrentSession = async () => {
	try {
		return account.updateSession("current");
	} catch (error) {
		console.log(error);
	}
};

export {
	COLLECTION_ID_EVENTS,
	COLLECTION_ID_EVENT_ITEMS,
	DATABASE_ID,
	account,
	client,
	databases,
	getCurrentSession,
	refreshCurrentSession,
	getCurrentUser,
	login,
	logout,
};
