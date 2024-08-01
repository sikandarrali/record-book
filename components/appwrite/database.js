import {
	COLLECTION_ID_BOOKS,
	COLLECTION_ID_BOOKS_RECORDS,
	COLLECTION_ID_DIARIES, COLLECTION_ID_DIARIES_RECORDS,
	DATABASE_ID,
	databases
} from "./appwrite";

import { ID } from "appwrite";

const collections = [
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_BOOKS,
		name: "pages",
	},
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_BOOKS_RECORDS,
		name: "records",
	},
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_DIARIES,
		name: "diaries",
	},
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_DIARIES_RECORDS,
		name: "diariesRecords",
	},
];

const db = {};

collections.forEach((collection) => {
	db[collection.name] = {
		list: (queries) =>
			databases.listDocuments(
				collection.databaseID,
				collection.id,
				queries
			),
		create: (payload, permissions) => {
			databases.createDocument(
				collection.databaseID,
				collection.id,
				ID.unique(),
				payload,
				permissions
			);
		},
		update: (payload, id, permissions) => {
			databases.updateDocument(
				collection.databaseID,
				collection.id,
				id,
				payload,
				permissions
			);
		},
		get: (id) => {
			databases.getDocument(collection.databaseID, collection.id, id);
		},
		delete: (id) => {
			databases.deleteDocument(collection.databaseID, collection.id, id);
		},
	};
});

export { db };
