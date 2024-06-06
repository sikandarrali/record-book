import {
	COLLECTION_ID_EVENTS,
	COLLECTION_ID_EVENT_ITEMS,
	DATABASE_ID,
	databases,
} from "./appwrite";

import { ID } from "appwrite";

const collections = [
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_EVENTS,
		name: "events",
	},
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_EVENT_ITEMS,
		name: "eventItems",
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
		create: (payload, id = ID.unique(), permissions) => {
			databases.createDocument(
				collection.databaseID,
				collection.id,
				id,
				payload,
				permissions
			);
		},
		update: (payload, id) => {
			databases.updateDocument(
				collection.databaseID,
				collection.id,
				id,
				payload
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

const id = ID;
const id2 = COLLECTION_ID_EVENT_ITEMS;
