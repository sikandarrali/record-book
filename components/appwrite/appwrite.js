import {Account, Client, Databases, Query, Teams} from "appwrite";
import {db} from "@/components/appwrite/database";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID_EVENTS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS;
const COLLECTION_ID_EVENT_ITEMS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS;
const COLLECTION_ID_USERS = process.env.NEXT_PUBLIC_COLLECTION_ID_USERS;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const teams = new Teams(client);

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
	COLLECTION_ID_USERS,
	DATABASE_ID,
	account,
	client,
	databases,
	teams,
	getCurrentSession,
	refreshCurrentSession,
	getCurrentUser,
	login,
	logout
};
