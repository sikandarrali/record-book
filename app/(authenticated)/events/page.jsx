"use client";
import { AddEvent } from "@/components/event/AddEvent";
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text";
import { FixStickyHeaderScrollError } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {client, DATABASE_ID, COLLECTION_ID_EVENTS, databases} from "@/components/appwrite/appwrite";
import {db} from "@/components/appwrite/database";
import {ID, Query} from "appwrite";


export default function Home() {
	const [openAddModal, setOpenAddModal] = useState(false);
	const scrollRef = useRef(null);
	const [currentEvent, setCurrentEvent] = useState(null);
	const [refreshItems, setRefreshItems] = useState(false)

	const emptyAll = useMyStore((state) => state.emptyEvents);
	const events = useMyStore((state) => state.events);
	const addEventInLocalStore = useMyStore((state) => state.addEvent);
	const addAllEventsInLocalStore = useMyStore((state) => state.updateEvents);

	const [eventsState, setEventsState] = useState([])

	const getEvents = async () =>{
		try {
			const response = await db.events.list([
				Query.orderDesc("$createdAt")
			]);

			addAllEventsInLocalStore(response.documents)
		} catch (error) {
			console.error("Error fetching event items:", error);
		}
	}

	useEffect(() => {
		getEvents();
	}, []);

	// re-populate events when created, fixes missing $id issue
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS}.documents`, (response) => {
			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				addEventInLocalStore(response.payload)
			}
		});

		return ()=> unsubscribe()
	}, []);

	useEffect(() => {
		if (scrollRef.current) {
			FixStickyHeaderScrollError(scrollRef.current);
		}
	}, []);


	return (
		<PageContainer hideTopbar>
			<Text variant="h2">Events</Text>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { duration: 0.3, delay: 0.4 },
				}}
				exit={{ opacity: 0 }}
				className="flex flex-col gap-4 -mx-4 px-4 mt-2 pb-20"
				ref={scrollRef}
			>
				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: 0.3 },
					}}
					onClick={() => setOpenAddModal(!openAddModal)}
					className="border-4 w-full border-dashed border-primary/30 hover:bg-muted cursor-pointer text-base font-medium text-center justify-center flex items-center px-6 py-8 rounded-md"
				>
					Add New Event
				</motion.div>

				{events.map((event, i) => (
					<motion.div
						initial={{ opacity: 0, y: 5 }}
						animate={{
							opacity: 1,
							y: 0,
							transition: { delay: 0.3 + i / 10 },
						}}
						key={i+event.name}
						className={'bg-muted hover:bg-muted-foreground/10 border border-primary/20 cursor-pointer text-primary text-xl font-semibold flex items-center justify-center shadow-sm rounded-lg'}
					>
						<Link
							className={"flex flex-1 px-6 py-8 text-center items-center justify-center"}
							href={`event/${event.$id}`}
						>
							{event.name}
						</Link>
					</motion.div>
				))}
			</motion.div>
			<AddEvent
				open={openAddModal}
				onOpenChange={setOpenAddModal}
				refreshItems={refreshItems}
				setRefreshItems={setRefreshItems}
			/>
		</PageContainer>
	);
}
