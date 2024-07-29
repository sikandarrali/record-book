import {Account, Client, Databases, Teams} from "appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID_PAGES = process.env.NEXT_PUBLIC_COLLECTION_ID_PAGES;
const COLLECTION_ID_RECORDS = process.env.NEXT_PUBLIC_COLLECTION_ID_RECORDS;
const PARENT_FIELD_IN_SINGLE_RECORD = "pageId";

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const teams = new Teams(client);

export { ID } from "appwrite";

export {
	account,
	client,
	databases,
	teams,
	ENDPOINT,
	PROJECT_ID,
	DATABASE_ID,
	COLLECTION_ID_PAGES,
	COLLECTION_ID_RECORDS,
	PARENT_FIELD_IN_SINGLE_RECORD
};
