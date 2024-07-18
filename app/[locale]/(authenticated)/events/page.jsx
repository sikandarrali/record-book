"use client";
import { AddEvent } from "@/components/event/AddEvent";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import { FixStickyHeaderScrollError } from "@/lib/utils";
import { motion } from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {client, listUserGroups, teams} from "@/components/appwrite/appwrite";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import SingleEventModal from "@/components/event/SingleEventModal";
import {useScopedI18n} from "@/locales/client";
import {useRouter} from "next/navigation";
import {useAuth} from "@/components/contexts/AuthContext";
import usePWAStatus from "@/lib/hooks/usePWAStatus";
import InstallApp from "@/components/InstallApp/InstallApp";

export default function Home() {
	const [openAddModal, setOpenAddModal] = useState(false);
	const scrollRef = useRef(null);
	const [refreshItems, setRefreshItems] = useState(false)
	const [events, setEvents] = useState([])
	const [userOwnedGroups, setUserOwnedGroups] = useState([])
	const t = useScopedI18n('events');
	const router = useRouter()
	const {user} = useAuth()

	const getEvents = async () =>{
		try {
			const response = await db.events.list([
				Query.orderDesc("$createdAt")
			]);

			setEvents(response.documents)
		} catch (error) {
			// console.error("Error fetching event items:", error);
		}
	}

	const getUserGroups = async () =>{
		const tempGroups = await teams.list()
		const tempOwnedGroups = tempGroups.teams.filter((item) => item.prefs.creatorEmail === user.email);
		setUserOwnedGroups(tempOwnedGroups)
	}

	useEffect(() => {
		getEvents();
		getUserGroups();
	}, [router]);

	// re-populate events when created, fixes missing $id issue
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS}.documents`, (response) => {
			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				setEvents(prev=> [response.payload, ...prev])
			}
			if(response.events.includes("databases.*.collections.*.documents.*.delete")){
				setEvents(prev=> prev.filter(item=> item.$id !== response.payload.$id))
			}
			if (response.events.includes("databases.*.collections.*.documents.*.update")) {
				setEvents(prev => {
					// Find the index of the item to update
					const index = prev.findIndex(item => item.$id === response.payload.$id);
					if (index !== -1) {
						// Create a new array with the updated item
						const updatedItems = [...prev];
						updatedItems[index] = response.payload; // Assuming response.payload contains the updated document data
						return updatedItems;
					}
					return prev;
				});
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

			<UIText variant="heading" className={'text-primary'}>{t('title')}</UIText>

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
					className="border-4 w-full border-dashed border-primary/30 hover:bg-muted cursor-pointer text-center justify-center flex items-center px-6 py-8 rounded-md"
				>
					<UIText variant={'heading'}>{t('addEvent')}</UIText>
				</motion.div>

				{events.map((event, i) => (
					<motion.div
						initial={{ opacity: 0, y: 5 }}
						animate={{
							opacity: 1,
							y: 0,
							transition: { delay: 0.3 + i / 10 },
						}}
						key={event.$id}
						className={'bg-muted hover:bg-muted-foreground/10 border border-primary/20 cursor-pointer text-primary text-xl font-semibold flex items-center justify-center shadow-sm rounded-lg'}
					>
						<SingleEventModal eventData={event} userOwnedGroups={userOwnedGroups}/>
					</motion.div>
				))}
			</motion.div>


			<AddEvent
				open={openAddModal}
				onOpenChange={setOpenAddModal}
				refreshItems={refreshItems}
				setRefreshItems={setRefreshItems}
				userOwnedGroups={userOwnedGroups}
			/>

		</PageContainer>
	);
}
