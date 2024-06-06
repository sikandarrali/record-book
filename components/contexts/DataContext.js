// context/DataContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../appwrite/database";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const { user } = useAuth();
	const userID = user?.$id;

	const [events, setEvents] = useState([]);

	const [eventItems, setEventItems] = useState([]);

	const init = async () => {
		const getEvents = await db.events.list();
		const getEventItems = await db.eventItems.list();

		setEvents(getEvents.documents);
		setEventItems(getEventItems.documents);
	};

	useEffect(() => {
		init();
	}, []);

	const getEventName = async (id) => {
		const name = await db.events.get(id);
		return name;
	};

	const values = useMemo(
		() => ({
			userID,
			events,
			eventItems,
			getEventName,
		}),
		[events, userID, eventItems]
	);

	// const values = {
	// 	userID,
	// 	events,
	// 	eventItems,
	// };

	return (
		<DataContext.Provider value={values}>{children}</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
