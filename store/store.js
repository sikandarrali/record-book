import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useMyStore = create(
	persist(
		(set) => ({
			events: [],
			eventItems: [],
			addEvent: (single) => {
				set((state) => ({
					events: [single, ...state.events],
				}));
			},
			deleteEvent: (deleteID) => {
				set((state) => ({
					events: state.events.filter(
						(item) => item.$id !== deleteID
					),
				}));
			},
			updateEvent: (updatedAttributes, id) =>
				set((state) => ({
					events: state.events.map((item) =>
						item.$id === id
							? { ...item, ...updatedAttributes }
							: item
					),
				})),
			updateEvents: (newEvents) => set({ events: newEvents }),
			emptyEvents: () => set({ events: [] }),

			addEventItem: (single) => {
				set((state) => ({
					eventItems: [single, ...state.eventItems],
				}));
			},
			deleteEventItem: (deleteID) => {
				set((state) => ({
					eventItems: state.eventItems.filter(
						(item) => item.$id !== deleteID
					),
				}));
			},
			updateEventItem: (id, updatedAttributes) =>
				set((state) => ({
					eventItems: state.eventItems.map((item) =>
						item.$id === id
							? { ...item, ...updatedAttributes }
							: item
					),
				})),
			updateEventItems: (newEventItems) =>
				set({ eventItems: newEventItems }),
			emptyEventItems: () => set({ eventItems: [] }),
		}),
		{
			name: "shadi-kharcha-record-store", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
		}
	)
);
