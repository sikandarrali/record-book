"use client";
import { AddEventItem } from "@/components/event-items/AddEventItem";
import { SingleListItem } from "@/components/event-items/SingleListItem";
import EventInfo from "@/components/event/EventInfo";
import LoadingFallback from "@/components/loaders/LoadingFallback";
import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {Info, MoveLeft, Plus, Users2, XIcon} from "lucide-react";
import {Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { NumericFormat } from "react-number-format";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {client, databases} from "@/components/appwrite/appwrite";
import {useMediaQuery} from "react-responsive";
import {cn} from "@/lib/utils";
import {
	Sheet,
	SheetContent,SheetHeader,
	SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import {SearchItems} from "@/components/event-items/SearchItems";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useAuth} from "@/components/contexts/AuthContext";
import {useScopedI18n} from "@/locales/client";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {notFound, useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import PageContainer from "@/components/providers/PageContainer";
import {Input} from "@/components/ui/input";
// import {toast} from "react-toastify";
// import {ToastOptions} from "@/lib/ToastOptions";

const EventPage = ({ userOwnedGroups }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [isOpen, setIsOpen] = useState(false)
	const headerRef = useRef(null);
	const t = useScopedI18n('events');

	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [eventData, setEventData] = useState(null)

	const [items, setItems] = useState([])
	const [itemsDefault, setItemsDefault] = useState([])
	const {user} = useAuth()
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
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
					process.env.NEXT_PUBLIC_DATABASE_ID,
					process.env.NEXT_PUBLIC_COLLECTION_ID_EVENTS,
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
		}
		getEventItems();
	}, [router]);
	//
	// appwrite realtime functionality
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS}.documents`, (response) => {
			console.log(response.payload)
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
			<div
				className={cn("w-full flex flex-col justify-start border-0")}
				// side={isDesktop ? "right" : "bottom"}
				// onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'relative flex flex-col flex-1'}>
					<Suspense fallback={<LoadingFallback />}>
						<div className="flex flex-col z-10">
							{/* header */}
							<div className="flex gap-4 pb-2 pt-2.5 rtl:flex-row-reverse justify-between items-center w-full z-20 border-b border-primary-foreground/40 relative" ref={headerRef}>

								<Button
									variant="ghost"
									className={'w-20'}
									onClick={()=> router.push('/events')}
								>
									<MoveLeft/>
								</Button>

								<div className="flex flex-1 justify-center col-span-4 items-center text-primary gap-2 relative select-none pointer-events-none">
									<span className="text-sm">Rs</span>
									<span className="font-bold text-xl">
										<NumericFormat
											allowNegative={false}
											value={totalSum}
											thousandSeparator={","}
											decimalSeparator={"."}
											displayType="text"
											decimalScale={2}
										/>
									</span>
								</div>

								<EventInfo
									eventData={eventData}
									sum={totalSum}
									userOwnedGroups={userOwnedGroups}
								/>

							</div>

							<div className={'flex items-center justify-center text-center gap-4 px-4 py-4 border-y text-primary bg-muted sticky top-40'}>
								<UIText
									variant={"heading"}
									className={cn(
										isStringUrdu(eventData?.name) ? 'font-urdu' : 'rtl:font-sans rtl:font-medium'
									)}
								>
									{eventData?.name}
								</UIText>
							</div>
						</div>

						<div className="flex flex-col pb-44 mt-5 px-6">
							{/* search */}
							<div className="relative h-14 mb-4">
								<Input
									placeholder={t('searchPlaceholder')}
									value={searchValue}
									onChange={(e) => onSearch(e.target.value)}
									className={cn("h-full normal-case rtl:text-xl rtl:font-urdu", isStringUrdu(searchValue) ? 'font-urdu' : 'rtl:font-sans')}
								/>

								{searchValue !== "" && (
									<XIcon
										className="w-4 h-4 text-primary absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 ltr:mr-3 rtl:ml-3 cursor-pointer hover:scale-125 duration-300"
										onClick={() => resetSearch()}
									/>
								)}

								{searchValue !== '' && searchResultsMessage !== '' && (
									<div className="flex flex-col justify-center items-center gap-10 px-6 mt-20 text-destructive">
										<UIText className="text-center text-lg font-medium">
											{t(searchResultsMessage)}
										</UIText>
									</div>
								)}
							</div>

							<UIText variant={'sm'} className={'py-1.5 font-medium flex items-center justify-center px-6 gap-2 text-muted-foreground'}>
								{searchValue === "" ?
									<>
										{t('totalEntries')}
										<span className={'text-primary font-semibold text-xl'}>
											{items.length}
										</span>
									</>
									:
									<>
										{t('numOfItemsMatchingSearch')}
										<span className={'text-primary font-semibold text-xl'}>
											{visibleItems.length}
										</span>
									</>
								}
							</UIText>

							<div className="flex flex-col overflow-y-auto -mx-6">

								{visibleItems.map((item, i) => (
									<motion.div key={item.$id}>
										<SingleListItem item={item} eventID={eventData.$id} />
									</motion.div>
								))}

								{searchValue === "" && items.length > 0 &&
									<div className={'flex flex-col w-full justify-center items-center mt-8 !border-t-0'}>
										{!hasMoreItems && <UIText className="mt-4 font-medium ltr:italic text-muted-foreground text-center">{t('allItemsShown')}</UIText>}

										{loadingItems ? (
												<Button
													disabled={loadingItems}
													onClick={loadMorePosts}
													variant={'outline'}
													className={'w-40 rtl:w-60 gap-2'}
													dir={'ltr'}
												>
													<ReloadIcon className="h-4 w-4 animate-spin" />
													<UIText>{t('btnLoading')}</UIText>
												</Button>
											) :
											hasMoreItems && items.length > itemsPerPage && (
												<Button
													onClick={loadMorePosts}
													variant={'secondary'}
													className={'w-40 rtl:w-60'}
												>
													<UIText>{t('btnLoadMore')}</UIText>
												</Button>
											)
										}
									</div>
								}

							</div>
						</div>

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

						<AddEventItem
							open={openAddModal}
							onOpenChange={setOpenAddModal}
							eventData={eventData}
						/>
					</Suspense>
				</div>
			</div>
		</PageContainer>
	);
};

export default EventPage;
