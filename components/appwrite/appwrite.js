import { Account, Client, Databases } from "appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID_EVENTS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS;
const COLLECTION_ID_EVENT_ITEMS =
	process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { ID } from "appwrite";

export {
	COLLECTION_ID_EVENTS,
	COLLECTION_ID_EVENT_ITEMS,
	DATABASE_ID,
	account,
	client,
	databases,
};
