import {databases} from "./appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID_EVENTS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS;
const COLLECTION_ID_EVENT_ITEMS = process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS;
const COLLECTION_ID_USERS = process.env.NEXT_PUBLIC_COLLECTION_ID_USERS;


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
	{
		databaseID: DATABASE_ID,
		id: COLLECTION_ID_USERS,
		name: "users",
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
