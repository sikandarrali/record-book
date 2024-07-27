"use client";
import { AddPage } from "@/components/event/AddPage";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {FixStickyHeaderScrollError} from "@/lib/utils";
import { motion } from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {client, COLLECTION_ID_PAGES, DATABASE_ID, teams} from "@/components/appwrite/appwrite";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {useI18n, useScopedI18n} from "@/locales/client";
import {useRouter} from "next/navigation";
import {useAuth} from "@/components/contexts/AuthContext";
import Link from "next/link";
import {LockKeyhole, Users2} from "lucide-react";
import {LOCALE_PUBLIC_ROUTES} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import ScrollToTopButton from "@/components/event/ScrollToTopButton";

export default function Home() {
	const [openAddModal, setOpenAddModal] = useState(false);
	const scrollRef = useRef(null);
	const [refreshItems, setRefreshItems] = useState(false)
	const [events, setEvents] = useState([])
	const [userOwnedGroups, setUserOwnedGroups] = useState([])
	const t = useI18n();
	const {user} = useAuth()

	const getEvents = async () =>{
		try {
			const response = await db.pages.list([
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
	}, []);

	// re-populate events when created, fixes missing $id issue
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_PAGES}.documents`, (response) => {
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
	//
	// console.log(LOCALE_PUBLIC_ROUTES())

	return (
		<PageContainer hideTopbar>

			<UIText variant="heading" className={'!text-primary mb-4'} text={t('pages.home.title')}/>

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
					className="border-4 w-full hover:bg-muted border-dotted border-primary cursor-pointer text-center justify-center flex items-center px-6 py-9 rtl:py-6 rounded-md"
				>
					<UIText variant={'heading'} text={t('pages.home.addNew')}/>
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
					>
						<Link
							href={`/book/${event.$id}`}
							className={'relative p-8 hover:bg-muted border cursor-pointer flex items-center justify-center shadow-sm rounded-lg text-center outline-none'}
						>
							<UIText variant={'heading'} className={'break-all'} text={event?.name} />
							{event.$permissions.some(permission => permission === `delete("user:${user.$id}")`) && <LockKeyhole className={'absolute left-2 top-2 w-5 h-5 text-primary'}/>}
							{event.teamId && <Users2 className={'absolute right-2 top-2 w-5 h-5 text-primary'}/>}
						</Link>
					</motion.div>
				))}
			</motion.div>

			<ScrollToTopButton/>

			<AddPage
				open={openAddModal}
				onOpenChange={setOpenAddModal}
				refreshItems={refreshItems}
				setRefreshItems={setRefreshItems}
				userOwnedGroups={userOwnedGroups}
			/>

		</PageContainer>
	);
}
