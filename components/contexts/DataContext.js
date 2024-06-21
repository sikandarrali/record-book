import { useMyStore } from "@/store/store";
import { Query } from "appwrite";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from "react";
import { db } from "../appwrite/database";
const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const events = useMyStore((state) => state.events);
	const updateEvents = useMyStore((state) => state.updateEvents);
	const updateEventItems = useMyStore((state) => state.updateEventItems);

	const getEvents = useCallback(async () => {
		try {
			const getEvents = await db.events.list([
				Query.orderDesc("$createdAt"),
			]);
			updateEvents(getEvents.documents);

			const getEventItems = await db.eventItems.list([
				Query.orderDesc("$createdAt"),
			]);
			updateEventItems(getEventItems.documents);
		} catch (error) {
			console.error("Error fetching events:", error);
		}
	}, []);

	const getEventItems = useCallback(async () => {
		try {
			const getEventItems = await db.eventItems.list([
				Query.orderDesc("$createdAt"),
			]);
			updateEventItems(getEventItems.documents);
		} catch (error) {
			console.error("Error fetching event items:", error);
		}
	}, []);

	const getCurrentEvent = useCallback(
		(eventID) => {
			return events.find((event) => event.$id === eventID);
		},
		[events]
	);

	useEffect(() => {
		getEvents();
	}, [getEvents]);

	useEffect(() => {
		getEventItems();
	}, [getEventItems]);

	const values = useMemo(
		() => ({
			getCurrentEvent,
		}),
		[events]
	);

	return (
		<DataContext.Provider value={values}>{children}</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
