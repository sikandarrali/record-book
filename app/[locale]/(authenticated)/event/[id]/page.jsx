"use client";
import { AddEventItem } from "@/components/event-items/AddEventItem";
import { SingleListItem } from "@/components/event-items/SingleListItem";
import EventInfo from "@/components/event/EventInfo";
import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {AnimatePresence, motion} from "framer-motion";
import {LockKeyhole, MoveLeft, Plus, Users2, XIcon} from "lucide-react";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { NumericFormat } from "react-number-format";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {
	client,
	COLLECTION_EVENT_ITEMS,
	COLLECTION_EVENTS,
	DATABASE_ID,
	databases
} from "@/components/appwrite/appwrite";
import {cn} from "@/lib/utils";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useScopedI18n} from "@/locales/client";
import {useParams, useRouter} from "next/navigation";
import PageContainer from "@/components/providers/PageContainer";
import ScrollToTopButton from "@/components/event/ScrollToTopButton";
import Link from "next/link";
import {UITextInput} from "@/components/theme/UITextInput";
import Loader from "@/components/loaders/loader";
import {useAuth} from "@/components/contexts/AuthContext";

const EventPage = () => {
	const headerRef = useRef(null);
	const t = useScopedI18n('events');
	const [localLoading, setLocalLoading] = useState(true)
	const {user} = useAuth()

	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [eventData, setEventData] = useState(null)

	const [items, setItems] = useState([])
	const [itemsDefault, setItemsDefault] = useState([])
	const router = useRouter()
	const [searchValue, setSearchValue] = useState("");
	const [searchResultsMessage, setSearchResultsMessage] = useState('')

	const params = useParams()

	const itemsPerPage = 15;
	const [visibleItems, setVisibleItems] = useState([]); // Currently visible items
	const [hasMoreItems, setHasMoreItems] = useState(true); // Flag to check if more items are available
	const [loadingItems, setLoadingItems] = useState(false); // To show loadingItems spinner

	// get event & items
	useLayoutEffect(() => {
		const getEventItems = async () => {
			try{
				const getEvent = await databases.getDocument(
					DATABASE_ID,
					COLLECTION_EVENTS,
					params.id
				);
				if(getEvent){
					setEventData(getEvent)
					const response = await db.eventItems.list([
						Query.orderDesc("$createdAt"),
						Query.equal('eventID', params.id)
					]);
					setItems(response.documents)
					setItemsDefault(response.documents)
				}
			}catch (e){
				router.replace('/404')
			}
			finally {
				setLocalLoading(false)
			}
		}
		if(user){
			getEventItems();
		}else{
			router.replace('/login')
		}
	}, [router]);
	//
	// appwrite realtime functionality
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_EVENT_ITEMS}.documents`, (response) => {
			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				if(response.payload.eventID === params.id){
					setItems(prev=> [response.payload, ...prev])
					setItemsDefault(prev=> [response.payload, ...prev])
				}
			}
			if(response.events.includes("databases.*.collections.*.documents.*.delete")){
				setItems(prev=> prev.filter(item=> item.$id !== response.payload.$id))
				setItemsDefault(prev=> prev.filter(item=> item.$id !== response.payload.$id))
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
					return prev;
				});
				setItemsDefault(prev => {
					// Find the index of the item to update
					const index = prev.findIndex(item => item.$id === response.payload.$id);
					if (index !== -1) {
						// Create a new array with the updated item
						const updatedItemsDefault = [...prev];
						updatedItemsDefault[index] = response.payload; // Assuming response.payload contains the updated document data
						return updatedItemsDefault;
					}
					return prev;
				});
			}
		});

		return ()=> unsubscribe()
	}, []);

	useEffect(() => {
		setTotalSum(itemsDefault?.reduce((acc, item) => acc + item.amount, 0));
	}, [itemsDefault]);
	//
	//
	// Function to load more items
	const loadMorePosts = useCallback(() => {
		if (loadingItems) return; // If already loadingItems, don't load more

		setLoadingItems(true);
		setTimeout(() => {
			const currentLength = visibleItems.length;
			const morePosts = items.slice(currentLength, currentLength + itemsPerPage);

			setVisibleItems(prevVisiblePosts => [
				...prevVisiblePosts,
				...morePosts
			]);

			if (currentLength + morePosts.length >= items.length) {
				setHasMoreItems(false);
			}

			setLoadingItems(false);
		}, 1000); // Simulate loadingItems time
	}, [visibleItems, items, loadingItems]);

	useEffect(() => {
		setItems(itemsDefault);
		setVisibleItems(itemsDefault.slice(0, itemsPerPage));
		setHasMoreItems(true)
		setLoadingItems(false)
	}, [itemsDefault]);


	const onSearch = (userValue) => {
		setSearchValue(userValue);
		if (userValue !== "") {
			const temp = itemsDefault?.filter((item) =>
				item.name.toLowerCase().includes(userValue.toLowerCase())
			);
			if(temp.length === 0){
				setSearchResultsMessage('searchNoItems')
			}else{
				setSearchResultsMessage('')
			}
			setVisibleItems(temp);
		}else{
			resetSearch()
		}
	};
	const resetSearch = () =>{
		setSearchValue('')
		setHasMoreItems(true)
		setVisibleItems(itemsDefault.slice(0, itemsPerPage))
	}

	return (
		<PageContainer noPadding>
			<AnimatePresence>
				{localLoading ?
					<Loader/>
					:
					<motion.div
						key={'content'}
						className={cn("w-full flex flex-col justify-start border-0")}
						initial={{opacity: 0, y: 4}}
						animate={{opacity: 1, y: 0, transition:{ease: "easeInOut", duration: 0.3}}}
					>
						<div className={'relative flex flex-col flex-1'}>
							{/*<Suspense fallback={<LoadingFallback />}>*/}
							<div className="flex flex-col">
								{/* header */}
								<div className="flex gap-4 pb-2 px-2 pt-2.5 rtl:flex-row-reverse justify-between items-center w-full border-b border-primary-foreground/40 relative" ref={headerRef}>

									<Link href={'/events'}>
										<Button
											variant="ghost"
											className={'w-14'}
											dir={'ltr'}
										>
											<MoveLeft/>
										</Button>
									</Link>

									<motion.div className="flex flex-1 justify-center col-span-4 items-center gap-2 relative select-none pointer-events-none" dir={'ltr'}>
										<span className="text-sm font-semibold">Rs</span>
										<UIText
											weight={'bold'}
											className="text-primary"
											variant={'heading'}
											text={
												<NumericFormat
													allowNegative={false}
													value={totalSum}
													thousandSeparator={","}
													decimalSeparator={"."}
													displayType="text"
													decimalScale={2}
												/>
											}
										/>
									</motion.div>

									<EventInfo
										eventData={eventData}
										setEventData={setEventData}
										sum={totalSum}
									/>

								</div>

								<div className={'flex items-center justify-center text-center break-all gap-4 px-14 py-8 border-y text-primary bg-muted relative'}>
									<UIText variant={"heading"} text={eventData?.name} className={'self-center'} />

									{eventData.$permissions.some(permission => permission === `delete("user:${user.$id}")`) && <LockKeyhole className={'absolute left-4 top-4 w-5 h-5'}/>}
									{eventData.teamId && <Users2 className={'absolute right-4 top-4 w-5 h-5'}/>}
								</div>
							</div>

							<div className="flex flex-col pb-44 mt-5 px-6">
								{/* search */}
								<div className="relative h-14 mb-4">
									<UITextInput
										placeholder={t('searchPlaceholder')}
										value={searchValue}
										onChange={(e) => onSearch(e.target.value)}
									/>

									{searchValue !== "" && (
										<XIcon
											className="w-4 h-4 text-primary absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 ltr:mr-3 rtl:ml-3 cursor-pointer hover:scale-125 duration-300"
											onClick={() => resetSearch()}
										/>
									)}

									{searchValue !== '' && searchResultsMessage !== '' && (
										<div className="flex flex-col justify-center items-center gap-10 px-6 mt-20 text-destructive">
											<UIText variant={'heading'} weight={'medium'} text={t(searchResultsMessage)}/>
										</div>
									)}
								</div>

								<div className={cn(
									'py-1.5 flex items-center justify-center px-6 gap-2 text-muted-foreground',
									(user?.prefs?.fontSize === "lg" || user?.prefs?.fontSize === "xl")  && "!my-5"
								)}>
									{searchValue === "" ?
										<>
											<UIText text={t('totalEntries')} weight={'medium'} />
											<UIText variant={'heading'} weight={'bold'} className={'text-primary rtl:mt-2'} text={items.length}/>
										</>
										:
										<>
											<UIText text={t('numOfItemsMatchingSearch')} weight={'medium'} />
											<UIText variant={'heading'} weight={'bold'} className={'text-primary rtl:mt-2'} text={visibleItems.length}/>
										</>
									}
								</div>

								<div className="flex flex-col overflow-y-auto -mx-6">

									{visibleItems.map((item, i) => (
										<motion.div key={item.$id}>
											<SingleListItem item={item} eventID={eventData.$id} />
										</motion.div>
									))}

									{searchValue === "" && items.length > 0 &&
										<div className={'flex flex-col w-full justify-center items-center mt-8 !border-t-0'}>
											{!hasMoreItems &&
												<UIText
													text={t('allItemsShown', { count: <span className={'text-primary px-2 font-sans text-2xl ltr:-mt-1 rlt:mt-1 font-bold'}>{items.length}</span> })}
													className="mt-4 text-muted-foreground text-center flex items-center"
													weight={'medium'}
												/>
											}

											{loadingItems ? (
													<Button
														disabled={loadingItems}
														onClick={loadMorePosts}
														variant={'outline'}
														className={'w-40 rtl:w-60 gap-2 rtl:py-3'}
														dir={'ltr'}
													>
														<ReloadIcon className="h-4 w-4 animate-spin" />
														<UIText variant={'button'} text={t('btnLoading')}/>
													</Button>
												) :
												hasMoreItems && items.length > itemsPerPage && (
													<Button
														onClick={loadMorePosts}
														variant={'secondary'}
														className={'w-40 rtl:w-60 rtl:py-3'}
													>
														<UIText variant={'button'} text={t('btnLoadMore')}/>
													</Button>
												)
											}
										</div>
									}

								</div>
							</div>
							{/*</Suspense>*/}
						</div>
					</motion.div>
				}
			</AnimatePresence>
			<div className={'relative'}>
				<div
					className="w-[4.5rem] h-[4.5rem] fixed bottom-16 left-1/2 -translate-x-1/2 shadow-lg flex items-center justify-center rounded-full bg-primary cursor-pointer"
					onClick={() => {
						setOpenAddModal(true)
						if (headerRef.current) {
							headerRef.current.scrollIntoView({ behavior: 'smooth' });
						}
					}}
				>
					<Plus className="text-white w-10 h-10" />
				</div>

				<ScrollToTopButton/>

				<AddEventItem
					open={openAddModal}
					onOpenChange={setOpenAddModal}
					eventData={eventData}
				/>
			</div>
		</PageContainer>
	);
};

export default EventPage;
