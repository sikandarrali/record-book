"use client";
import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useLayoutEffect, useState} from "react";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {
	client,
	COLLECTION_ID_DIARIES_RECORDS,
	COLLECTION_ID_DIARIES,
	DATABASE_ID,
	databases, PARENT_DIARY_ID_FIELD_NAME
} from "@/components/appwrite/appwrite";
import {cn} from "@/lib/utils";
import {CheckIcon} from "@radix-ui/react-icons";
import {useI18n} from "@/locales/client";
import {useParams, useRouter} from "next/navigation";
import PageContainer from "@/components/providers/PageContainer";
import ScrollToTopButton from "@/components/page/ScrollToTopButton";
import Loader from "@/components/loaders/loader";
import {useAuth} from "@/components/contexts/AuthContext";
import {PopupPageCreatedByYou} from "@/components/theme/PopupPageCreatedByYou";
import {PopupPageSharedWithGroup} from "@/components/theme/PopupPageSharedWithGroup";
import {AddDiaryRecord} from "@/components/diaryRecord/AddDiaryRecord";
import {SingleDiaryRecord} from "@/components/diaryRecord/SingleDiaryRecord";
import DiaryInfo from "@/components/diary/DiaryInfo";

const Page = () => {
	const t = useI18n();
	const [localLoading, setLocalLoading] = useState(true)
	const {user} = useAuth()
	const [openAddModal, setOpenAddModal] = useState(false);
	const [diaryData, setDiaryData] = useState(null)
	const [items, setItems] = useState([])
	const [itemsDefault, setItemsDefault] = useState([])
	const router = useRouter()
	const params = useParams()

	// get event & items
	useLayoutEffect(() => {
		const getDiaryItems = async () => {
			try{
				const getEvent = await databases.getDocument(
					DATABASE_ID,
					COLLECTION_ID_DIARIES,
					params.id
				);
				if(getEvent){
					setDiaryData(getEvent)
					const response = await db.diariesRecords.list([
						Query.equal(PARENT_DIARY_ID_FIELD_NAME, params.id),
						Query.orderDesc("$createdAt"),
						Query.limit(1000)
					]);
					setItems(response.documents)
				}
			}catch (e){}
			finally {
				setLocalLoading(false)
			}
		}
		if(user){
			getDiaryItems();
		}else{
			router.replace('/login')
		}
	}, [router]);
	//
	// appwrite realtime functionality
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_DIARIES_RECORDS}.documents`, (response) => {

			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				if(response.payload[PARENT_DIARY_ID_FIELD_NAME] === params.id){
					// const sorted = SortItemsByDateAndCreatedAt()
					setItems(prev=> [response.payload, ...prev])
				}
			}
			if(response.events.includes("databases.*.collections.*.documents.*.delete")){
				setItems(prev=> prev.filter(item=> item.$id !== response.payload.$id))
			}
			if (response.events.includes("databases.*.collections.*.documents.*.update")) {
				setItems(prev => {
					// Find the index of the item to update
					const index = prev.findIndex(item => item.$id === response.payload.$id);
					if (index !== -1) {
						// Create a new array with the updated item
						const updatedItems = [...prev];
						updatedItems[index] = response.payload; // Assuming response.payload contains the updated document data
						return updatedItems;
					}
					return [...prev, response.payload];

				});
			}
		});

		return ()=> unsubscribe()
	}, []);

	const onMarkAsDone = async (itemID) => {

		const getItem = await databases.getDocument(DATABASE_ID, COLLECTION_ID_DIARIES_RECORDS, itemID);

		const tempUpdatedBy = [user?.name, user?.email];
		const diaryItems = {
			name: getItem.name,
			markedAsDone: !getItem.markedAsDone,
			createdBy: getItem.createdBy,
			updatedBy: tempUpdatedBy
		};

		try {
			await db.diariesRecords.update(diaryItems, itemID);
		} catch (error) {
			// toast.error(t('alerts.exception'), ToastOptions);
		}
	};


	return (
		<PageContainer noPadding>
			<AnimatePresence>
				{localLoading ?
					<Loader/>
					:
					<motion.div
						key={'content'}
						className={cn("w-full flex px-2 flex-col justify-start border-0")}
						initial={{opacity: 0, y: 4}}
						animate={{opacity: 1, y: 0, transition:{ease: "easeInOut", duration: 0.3}}}
					>
						<div className={'relative flex flex-col flex-1'}>

							<div className={'absolute -top-14 w-full'}>

								{/* Badges */}
								<div className={'flex items-center relative gap-2 justify-end '} dir={"ltr"}>
									{diaryData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`) &&
										<PopupPageCreatedByYou side={'left'} align={'start'} className={'max-w-56 bg-muted'}/>
									}

									{diaryData?.teamId &&
										<PopupPageSharedWithGroup teamId={diaryData?.teamId} side={'left'} align={'start'} className={'flex bg-muted flex-col gap-2'}/>
									}
								</div>

								<div className={'absolute position-center-horizontally top-0'}>
									<DiaryInfo
										diaryData={diaryData}
										setDiaryData={setDiaryData}
									/>
								</div>

							</div>

							{/* Name */}
							<UIText variant={"heading"} text={diaryData?.name} className={'pt-4 pb-4 !text-primary self-center'} textOrientation={'center'} />

							<div className="flex flex-col pb-44">

								<div className="flex flex-col overflow-y-auto -mx-8">

									{/* Records List */}
									{items?.length === 0 ?
										<div className={'px-8 text-center pt-10'}>
											<UIText text={t('pages.diaries.noDiariesRecords')} variant={'lg'}/>
										</div>
									:
										items.map((item, i) => (
											<motion.div key={item.$id} className={'flex group items-center ltr:pl-8 rtl:pr-8 gap-4'}>
												<div className={'cursor-pointer p-2 flex items-center justify-center shrink-0'} onClick={()=> onMarkAsDone(item.$id)}>
													<div
														className={cn(
															"border-2 border-border flex items-center justify-center rounded-full w-10 h-10 shrink-0 cursor-pointer",
															item.markedAsDone && "bg-primary border-primary"
														)}
													>
														{item.markedAsDone && <CheckIcon className={'text-primary-foreground w-7 h-7 stroke-[2.5]'}/>}
													</div>
												</div>
												<SingleDiaryRecord item={item}/>
											</motion.div>
										))
									}
								</div>
							</div>
							{/*</Suspense>*/}
						</div>
					</motion.div>
				}
			</AnimatePresence>
			<div className={'relative'}>

				{/* Add Record Button*/}
				<div className={'fixed bottom-10 position-center-horizontally max-w-lg z-20 flex items-center justify-center px-6 left-0 w-full'}>
					<Button
						onClick={() => setOpenAddModal(true)}
						className="flex flex-1 min-h-14"
					>
						<UIText variant={'heading'} text={t('pages.records.add')}/>
					</Button>
				</div>

				{/* Add Record Button Round*/}
				{/*<div*/}
				{/*	className="w-[4.5rem] h-[4.5rem] fixed bottom-16 left-1/2 -translate-x-1/2 shadow-lg flex items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer"*/}
				{/*	onClick={() => {*/}
				{/*		setOpenAddModal(true)*/}
				{/*		if (headerRef.current) {*/}
				{/*			headerRef.current.scrollIntoView({ behavior: 'smooth' });*/}
				{/*		}*/}
				{/*	}}*/}
				{/*>*/}
				{/*	<Plus className="w-10 h-10" />*/}
				{/*</div>*/}
				<AddDiaryRecord
					open={openAddModal}
					onOpenChange={setOpenAddModal}
					diaryData={diaryData}
				/>

				{/* Scroll to Top Button */}
				<ScrollToTopButton/>
			</div>
		</PageContainer>
	);
};

export default Page;
