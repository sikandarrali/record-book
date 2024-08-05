"use client";
import { AddRecord } from "@/components/record/AddRecord";
import { SingleRecord } from "@/components/record/SingleRecord";
import PageInfo from "@/components/page/PageInfo";
import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {AnimatePresence, motion} from "framer-motion";
import {Minus, Plus, Search, SquarePen, XIcon} from "lucide-react";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { NumericFormat } from "react-number-format";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {
	client,
	COLLECTION_ID_BOOKS_RECORDS,
	COLLECTION_ID_BOOKS,
	DATABASE_ID,
	databases, PARENT_BOOK_ID_FIELD_NAME
} from "@/components/appwrite/appwrite";
import {cn, getCurrentCurrency, SortItemsByDateAndCreatedAt} from "@/lib/utils";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useI18n, useScopedI18n} from "@/locales/client";
import {useParams, useRouter} from "next/navigation";
import PageContainer from "@/components/providers/PageContainer";
import ScrollToTopButton from "@/components/page/ScrollToTopButton";
import {UITextInput} from "@/components/theme/UITextInput";
import Loader from "@/components/loaders/loader";
import {useAuth} from "@/components/contexts/AuthContext";
import {HOMEPAGE_ROUTE} from "@/lib/routes";
import {useData} from "@/components/contexts/DataContext";
import {PopupPageCreatedByYou} from "@/components/theme/PopupPageCreatedByYou";
import {PopupPageSharedWithGroup} from "@/components/theme/PopupPageSharedWithGroup";
import {BookType} from "@/components/page/BookType";
import {FormattedCurrency} from "@/components/theme/FormattedCurrency";
import {SearchSheet} from "@/components/record/SearchSheet";

const data = [
	{id: 1, name: 'a', date:'2024-07-29T21:00:07.364Z', createdAt: '2024-07-28T21:00:07.364Z'},
	{id: 2, name: 'b', date:'', createdAt: '2024-07-28T21:00:07.364Z'},
	{id: 3, name: 'c', date:'2023-07-29T21:00:07.364Z', createdAt: '2024-07-28T21:00:07.364Z'},
	{id: 4, name: 'd', date:'2023-07-29T21:00:07.364Z', createdAt: '2024-07-28T21:00:07.364Z'},
]

const Page = () => {
	const headerRef = useRef(null);
	const t = useI18n();
	const [localLoading, setLocalLoading] = useState(true)
	const {user} = useAuth()
	const {userGroups} = useData()

	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [pageData, setPageData] = useState(null)

	const [openSearch, setOpenSearch] = useState(false)

	const [items, setItems] = useState([])
	const router = useRouter()
	const [searchValue, setSearchValue] = useState("");
	const [searchResultsMessage, setSearchResultsMessage] = useState('')
	const [count, setCount] = useState(0)

	const limit = 25;
	const [lastId, setLastId] = useState(null)

	const params = useParams()

	const itemsPerPage = 15;
	const [hasMoreItems, setHasMoreItems] = useState(true); // Flag to check if more items are available
	const [loadingItems, setLoadingItems] = useState(false); // To show loadingItems spinner

	// get event & items
	useLayoutEffect(() => {
		if(user){
			getItems();
		}
	}, [router]);
	//

	const getItems = async () => {
		try{
			const getEvent = await databases.getDocument(
				DATABASE_ID,
				COLLECTION_ID_BOOKS,
				params.id
			);
			if(getEvent){
				setPageData(getEvent)
				let response = {}

				if(lastId){
					response = await db.records.list([
						Query.equal(PARENT_BOOK_ID_FIELD_NAME, params.id),
						Query.orderDesc("$createdAt"),
						Query.orderDesc("date"),
						Query.limit(limit),
						Query.cursorAfter(lastId),
					]);
				}else{
					response = await db.records.list([
						Query.equal(PARENT_BOOK_ID_FIELD_NAME, params.id),
						Query.orderDesc("$createdAt"),
						Query.orderDesc("date"),
						Query.limit(limit)
					]);
				}
				setItems([...items, ...response.documents])
				setCount(response.total)
				setLastId(response.documents[response.documents.length-1].$id)
			}
		}catch (e){
			console.log(e)
			// router.replace(HOMEPAGE_ROUTE)
		}
		finally {
			setLocalLoading(false)
		}
	}

	const loadMoreItems = async () =>{
		setLoadingItems(true);
		getItems().then(()=>{
			setLoadingItems(false)
		})
	}

	const getCount = async () =>{
		const response = await db.records.list([
			Query.equal(PARENT_BOOK_ID_FIELD_NAME, params.id),
			Query.orderDesc("$createdAt"),
			Query.orderDesc("date")
		]);
		setCount(response.total)
	}

	// appwrite realtime functionality
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_BOOKS_RECORDS}.documents`, (response) => {

			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				if(response.payload[PARENT_BOOK_ID_FIELD_NAME] === params.id){
					// const sorted = SortItemsByDateAndCreatedAt()
					setItems(prev=> SortItemsByDateAndCreatedAt([response.payload, ...prev]))

					getCount()
				}
			}
			if(response.events.includes("databases.*.collections.*.documents.*.delete")){
				setItems(prev=> SortItemsByDateAndCreatedAt(prev.filter(item=> item.$id !== response.payload.$id)))
				getCount()
			}
			if (response.events.includes("databases.*.collections.*.documents.*.update")) {
				setItems(prev => {
					// Find the index of the item to update
					const index = prev.findIndex(item => item.$id === response.payload.$id);
					if (index !== -1) {
						// Create a new array with the updated item
						const updatedItems = [...prev];
						updatedItems[index] = response.payload; // Assuming response.payload contains the updated document data
						return SortItemsByDateAndCreatedAt(updatedItems);
					}
					return SortItemsByDateAndCreatedAt([...prev, response.payload]);

				});
			}
		});

		return ()=> unsubscribe()
	}, []);

	useEffect(() => {
		setTotalSum(
			items?.reduce((acc, item) => {
				return item.type === 'income'
					? acc + item.amount
					: acc - item.amount;
			}, 0)
		);
	}, [items]);

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
								<div className={'flex items-center gap-2 justify-end'} dir={"ltr"}>
									{pageData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`) &&
										<PopupPageCreatedByYou side={'left'} align={'start'} className={'max-w-56 bg-muted'}/>
									}
									{pageData?.teamId &&
										<PopupPageSharedWithGroup teamId={pageData?.teamId} side={'left'} align={'start'} className={'flex bg-muted flex-col gap-2'}/>
									}
								</div>

								{/* Book Info */}
								<div className={cn(
									'absolute position-center-horizontally top-0 rtl:-top-1.5',
									user?.prefs?.fontSize === "lg" && "-top-0.5 rtl:-top-2",
									user?.prefs?.fontSize === "xl" && "-top-1 rtl:-top-3"
								)}>
									<PageInfo
										pageData={pageData}
										setPageData={setPageData}
										sum={totalSum}
									/>
								</div>
							</div>

							{/* Name */}
							<UIText variant={"heading"} text={pageData?.name} className={'pt-2 pb-6 !text-primary self-center'} textOrientation={'center'} />

							{/* Total Amount & Search */}
							<motion.div className="flex flex-1 py-4 gap-2 justify-between items-center border-b relative select-none" dir={'ltr'}>

								{/* Amount */}
								<div className={'flex flex-col text-ellipsis overflow-hidden'}>
									<UIText
										weight={'bold'}
										className={cn(totalSum < 0 && "text-destructive", "text-ellipsis overflow-hidden")}
										variant={'heading'}
										text={
											<FormattedCurrency
												value={totalSum}
												currency={getCurrentCurrency(pageData?.currency)}
											/>
										}
									/>
								</div>

								{/* Search Button */}
								<Button
									onClick={()=> setOpenSearch(true)}
									className={'px-3 gap-2'}
								>
									<Search className={'w-4 h-4 stroke-2.5'} />
									<UIText text={t('labels.search')} variant={'sm'}/>
								</Button>
							</motion.div>

							<div className="flex flex-col pb-44">

								{/* Number of Records & Search Result Items */}
								<div className={cn(
									'py-1.5 flex items-center justify-center px-6 my-4 gap-2 text-muted-foreground',
									(user?.prefs?.fontSize === "lg" || user?.prefs?.fontSize === "xl") && "rtl:my-6"
									)}
								>
									<UIText text={t('pages.records.totalEntries')} weight={'medium'} className={cn("rtl:-mt-4")}/>
									<UIText variant={'heading'} weight={'bold'} className={'!text-primary rtl:-mt-1'} text={count}/>
								</div>

								<div className="flex flex-col overflow-y-auto -mx-8">

									{/* Records List */}
									{SortItemsByDateAndCreatedAt(items).map((item, i) => (
										<motion.div key={item.$id}>
											<SingleRecord item={item} bookCurrency={pageData?.currency} />
										</motion.div>
									))}

									{/* Load More/Loaded Buttons & Loading/All Items Loaded Message */}
									<div className={'flex flex-col w-full justify-center items-center mt-8 !border-t-0'}>
										{items.length === count ?
											<UIText
												text={t('pages.records.allItemsShown', { count: <span className={'!text-primary px-2 font-sans text-2xl ltr:-mt-1 rlt:mt-1 font-bold'}>{items.length}</span> })}
												className="mt-4 text-muted-foreground text-center flex items-center"
												weight={'medium'}
											/>

											: loadingItems ? (
												<Button
													disabled={loadingItems}
													onClick={loadMoreItems}
													variant={'outline'}
													className={'w-40 rtl:w-60 gap-2 rtl:py-3'}
													dir={'ltr'}
												>
													<ReloadIcon className="h-4 w-4 animate-spin" />
													<UIText variant={'button'} text={t('buttons.btnLoading')}/>
												</Button>
											)
												:
												<Button
													onClick={loadMoreItems}
													variant={'secondary'}
													className={'w-40 rtl:w-60 rtl:py-3'}
												>
													<UIText variant={'button'} text={t('buttons.btnLoadMore')}/>
												</Button>
										}
									</div>

								</div>
							</div>
							{/*</Suspense>*/}
						</div>
					</motion.div>
				}
			</AnimatePresence>

			{/* Add Record Button */}
			<div className={'fixed bottom-10 position-center-horizontally max-w-lg z-20 flex items-center justify-center px-6 left-0 w-full'}>
				<Button
					onClick={() => setOpenAddModal(true)}
					className="flex flex-1 min-h-14"
				>
					<UIText variant={'heading'} text={t('pages.records.add')}/>
				</Button>
			</div>

			<AddRecord
				open={openAddModal}
				onOpenChange={setOpenAddModal}
				pageData={pageData}
			/>

			{/* Scroll to Top Button */}
			<ScrollToTopButton/>

			{/*	Search Modal */}
			<SearchSheet
				open={openSearch}
				onOpenChange={setOpenSearch}
				pageData={pageData}
			/>

		</PageContainer>
	);
};

export default Page;
