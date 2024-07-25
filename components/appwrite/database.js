import {COLLECTION_ID_PAGES, COLLECTION_ID_RECORDS, DATABASE_ID, databases} from "./appwrite";

import { ID } from "appwrite";

const collections = [
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_PAGES,
		name: "pages",
	},
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_RECORDS,
		name: "records",
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
