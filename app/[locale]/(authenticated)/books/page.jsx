"use client";
import { AddPage } from "@/components/page/AddPage";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {cn, FixStickyHeaderScrollError} from "@/lib/utils";
import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {client, COLLECTION_ID_BOOKS, DATABASE_ID, teams} from "@/components/appwrite/appwrite";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {useI18n} from "@/locales/client";
import {useAuth} from "@/components/contexts/AuthContext";
import Link from "next/link";
import {LockKeyhole, Users2} from "lucide-react";
import {Button} from "@/components/ui/button";
import ScrollToTopButton from "@/components/page/ScrollToTopButton";
import Loader from "@/components/loaders/loader";

export default function Page() {
	const [openAddModal, setOpenAddModal] = useState(false);
	const [localLoading, setLocalLoading] = useState(true)
	const scrollRef = useRef(null);
	const [refreshItems, setRefreshItems] = useState(false)
	const [events, setBooks] = useState([])
	const [userOwnedGroups, setUserOwnedGroups] = useState([])
	const t = useI18n();
	const {user} = useAuth()

	const getEvents = async () =>{
		try {
			const response = await db.pages.list([
				Query.orderDesc("$createdAt"),
				Query.limit(1000)
			]);

			setBooks(response.documents)
		} catch (error) {}
		finally {
			setLocalLoading(false)
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
		const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_BOOKS}.documents`, (response) => {
			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				setBooks(prev=> [response.payload, ...prev])
			}
			if(response.events.includes("databases.*.collections.*.documents.*.delete")){
				setBooks(prev=> prev.filter(item=> item.$id !== response.payload.$id))
			}
			if (response.events.includes("databases.*.collections.*.documents.*.update")) {
				setBooks(prev => {
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
		<PageContainer title={t('pages.books.titleBooks')} hideBackButton>
			{localLoading ?
				<Loader/>
				:
				<motion.div
					initial={{ opacity: 0 }}
					animate={{
						opacity: 1,
						transition: { duration: 0.3, delay: 0.4 },
					}}
					exit={{ opacity: 0 }}
					className="flex flex-col gap-9 rtl:gap-10 mt-10 pb-20"
					ref={scrollRef}
				>
					{/* Book List */}
					{events.length === 0 ?
						<div className={'p-4 text-center mt-4 text-destructive'}>
							<UIText text={t('pages.books.noBooks')} weight={'semibold'}/>
						</div>
						:
						events.map((book, i) => (
							<motion.div
								initial={{ opacity: 0, y: 5 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: { delay: 0.3 + i / 10 },
								}}
								key={book.$id}
								className={'relative pt-4 group'}
							>
								<div className={cn(
										'absolute -top-4 rtl:-top-5 left-0 group-hover:bg-muted rounded-lg rounded-bl-none rounded-br-none border-b-0 bg-background z-10 border px-2 py-1',
										user?.prefs?.fontSize === "lg" && "rtl:-top-6 pb-2",
										user?.prefs?.fontSize === "xl" && "rtl:-top-7 pb-2",
									)}
								>
									<UIText text={t(`labels.${book.type}`)} weight={'medium'} variant={'xs'}/>
								</div>
								<div className={'absolute -top-4 right-0 flex gap-2 pt-2 pr-2'}>
									{book.$permissions.some(permission => permission === `delete("user:${user.$id}")`) && <LockKeyhole className={'w-5 h-5 text-primary'}/>}
									{book.teamId && <Users2 className={'w-5 h-5 text-primary'}/>}
								</div>
								<Link
									href={`/book/${book.$id}`}
									className={'relative bg-background z-20 p-8 group-hover:bg-muted border cursor-pointer flex items-center justify-center shadow-sm rounded-lg rounded-tl-none text-center outline-none'}
								>
									<UIText variant={'heading'} className={'break-words text-primary'} text={book?.name} textOrientation={'center'} />
								</Link>
							</motion.div>
						))
					}
				</motion.div>
			}

			{/* Add New Button */}
			<div className={'fixed bottom-10 position-center-horizontally max-w-lg z-20 flex items-center justify-center px-6 left-0 w-full'}>
				<Button
					onClick={() => setOpenAddModal(!openAddModal)}
					className="flex flex-1 min-h-14"
				>
					<UIText variant={'heading'} text={t('pages.books.addNew')}/>
				</Button>
			</div>

			<AddPage
				open={openAddModal}
				onOpenChange={setOpenAddModal}
				refreshItems={refreshItems}
				setRefreshItems={setRefreshItems}
				userOwnedGroups={userOwnedGroups}
			/>

			{/* Scroll to Top Button */}
			<ScrollToTopButton/>

		</PageContainer>
	);
}
