import { Account, Client, Databases } from "appwrite";

const ENDPOINT = "https://bank.aasaan-apps.store/v1";
const PROJECT_ID = "6660a1af002848880bed";
const DATABASE_ID = "6660a667000df842286c";
const COLLECTION_ID_EVENTS = "6660a671001bf5b13854";
const COLLECTION_ID_EVENT_ITEMS = "6660a9920026bf69ebea";

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
