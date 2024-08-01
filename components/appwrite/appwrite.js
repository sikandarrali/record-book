import {Account, Client, Databases, Teams} from "appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID_BOOKS = process.env.NEXT_PUBLIC_COLLECTION_ID_BOOKS;
const COLLECTION_ID_BOOKS_RECORDS = process.env.NEXT_PUBLIC_COLLECTION_ID_BOOKS_RECORDS;
const PARENT_BOOK_ID_FIELD_NAME = "pageId";
const COLLECTION_ID_DIARIES = process.env.NEXT_PUBLIC_COLLECTION_ID_DIARIES;
const COLLECTION_ID_DIARIES_RECORDS = process.env.NEXT_PUBLIC_COLLECTION_ID_DIARIES_RECORDS;
const PARENT_DIARY_ID_FIELD_NAME = "diaryId";

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
	COLLECTION_ID_BOOKS,
	COLLECTION_ID_BOOKS_RECORDS,
	PARENT_BOOK_ID_FIELD_NAME,
	COLLECTION_ID_DIARIES,
	COLLECTION_ID_DIARIES_RECORDS,
	PARENT_DIARY_ID_FIELD_NAME
};
