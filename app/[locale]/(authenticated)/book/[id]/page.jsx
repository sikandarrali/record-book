"use client";
import { AddRecord } from "@/components/event-items/AddRecord";
import { SingleRecord } from "@/components/event-items/SingleRecord";
import PageInfo from "@/components/event/PageInfo";
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
	COLLECTION_ID_RECORDS,
	COLLECTION_ID_PAGES,
	DATABASE_ID,
	databases, PARENT_FIELD_IN_SINGLE_RECORD
} from "@/components/appwrite/appwrite";
import {cn} from "@/lib/utils";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useI18n, useScopedI18n} from "@/locales/client";
import {useParams, useRouter} from "next/navigation";
import PageContainer from "@/components/providers/PageContainer";
import ScrollToTopButton from "@/components/event/ScrollToTopButton";
import Link from "next/link";
import {UITextInput} from "@/components/theme/UITextInput";
import Loader from "@/components/loaders/loader";
import {useAuth} from "@/components/contexts/AuthContext";
import {HOMEPAGE_ROUTE} from "@/lib/routes";
import {Badge} from "@/components/ui/badge";

const Page = () => {
	const headerRef = useRef(null);
	const t = useI18n();
	const [localLoading, setLocalLoading] = useState(true)
	const {user} = useAuth()

	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [pageData, setPageData] = useState(null)

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
					COLLECTION_ID_PAGES,
					params.id
				);
				if(getEvent){
					setPageData(getEvent)
					const response = await db.records.list([
						Query.orderDesc("$createdAt"),
						Query.equal(PARENT_FIELD_IN_SINGLE_RECORD, params.id)
					]);
					setItems(response.documents)
					setItemsDefault(response.documents)
				}
			}catch (e){
				// console.log(e)
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
		const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_RECORDS}.documents`, (response) => {

			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				if(response.payload[PARENT_FIELD_IN_SINGLE_RECORD] === params.id){
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
		setTotalSum(
			itemsDefault?.reduce((acc, item) => {
				return item.type === 'income'
					? acc + item.amount
					: acc - item.amount;
			}, 0)
		);
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
				setSearchResultsMessage('pages.records.noSearchItemsFound')
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
						className={cn("w-full flex px-2 flex-col justify-start border-0")}
						initial={{opacity: 0, y: 4}}
						animate={{opacity: 1, y: 0, transition:{ease: "easeInOut", duration: 0.3}}}
					>
						<div className={'relative flex flex-col flex-1'}>

							<div className={'flex items-center gap-4 justify-center mb-4'}>
								{pageData.$permissions.some(permission => permission === `delete("user:${user.$id}")`) && <Badge variant={'secondary'}><UIText variant={'xs'} className={'!text-accent-foreground'} text={t('pages.records.badgeCreatedByYou')}/> </Badge>}
								{pageData.teamId && <Badge><UIText variant={'xs'} text={t('pages.records.badgeSharedWithGroup')}/> </Badge>}
							</div>

							{/* header */}
							<div className="flex gap-4 pb-4 pt-2.5 justify-between items-center w-full border-b border-border relative" ref={headerRef}>

								<div className={'flex items-center justify-center text-center break-all gap-4 relative'}>
									<UIText variant={"heading"} text={pageData?.name} className={'self-center !text-primary'} />
								</div>

								<PageInfo
									pageData={pageData}
									setPageData={setPageData}
									sum={totalSum}
								/>

							</div>

							<motion.div className="flex flex-1 py-8 justify-center col-span-4 items-center gap-2 relative select-none pointer-events-none" dir={'ltr'}>
								<span className="text-sm font-semibold">Rs</span>
								<UIText
									weight={'bold'}
									className="!text-primary"
									variant={'heading'}
									text={
										<NumericFormat
											value={totalSum}
											thousandSeparator={","}
											decimalSeparator={"."}
											displayType="text"
											decimalScale={2}
										/>
									}
								/>
							</motion.div>

							<div className="flex flex-col pb-44">
								{/* search */}
								<div className="relative h-14 mb-4">
									<UITextInput
										placeholder={t('pages.records.searchPlaceholder')}
										value={searchValue}
										onChange={(e) => onSearch(e.target.value)}
									/>

									{searchValue !== "" && (
										<XIcon
											className="w-4 h-4 !text-primary absolute ltr:right-0 -mt-1 rtl:left-0 top-1/2 -translate-y-1/2 ltr:mr-3 rtl:ml-3 cursor-pointer hover:scale-125 duration-300"
											onClick={() => resetSearch()}
										/>
									)}

									{searchValue !== '' && searchResultsMessage !== '' && (
										<div className="flex flex-col justify-center items-center gap-10 px-6 mt-20 ">
											<UIText variant={'heading'} weight={'medium'} className={'!text-destructive'} text={t(searchResultsMessage)}/>
										</div>
									)}
								</div>

								<div className={cn(
									'py-1.5 flex items-center justify-center px-6 gap-2 text-muted-foreground',
									(user?.prefs?.fontSize === "lg" || user?.prefs?.fontSize === "xl")  && "!my-5"
								)}>
									{searchValue === "" ?
										<>
											<UIText text={t('pages.records.totalEntries')} weight={'medium'} />
											<UIText variant={'heading'} weight={'bold'} className={'!text-primary rtl:mt-2'} text={items.length}/>
										</>
										:
										<>
											<UIText text={t('pages.records.numOfItemsMatchingSearch')} weight={'medium'} />
											<UIText variant={'heading'} weight={'bold'} className={'!text-primary rtl:mt-2'} text={visibleItems.length}/>
										</>
									}
								</div>

								<div className="flex flex-col overflow-y-auto -mx-8">

									{visibleItems.map((item, i) => (
										<motion.div key={item.$id}>
											<SingleRecord item={item} />
										</motion.div>
									))}

									{searchValue === "" && items.length > 0 &&
										<div className={'flex flex-col w-full justify-center items-center mt-8 !border-t-0'}>
											{!hasMoreItems &&
												<UIText
													text={t('pages.records.allItemsShown', { count: <span className={'!text-primary px-2 font-sans text-2xl ltr:-mt-1 rlt:mt-1 font-bold'}>{items.length}</span> })}
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
														<UIText variant={'button'} text={t('buttons.loading')}/>
													</Button>
												) :
												hasMoreItems && items.length > itemsPerPage && (
													<Button
														onClick={loadMorePosts}
														variant={'secondary'}
														className={'w-40 rtl:w-60 rtl:py-3'}
													>
														<UIText variant={'button'} text={t('buttons.loadMore')}/>
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

				<AddRecord
					open={openAddModal}
					onOpenChange={setOpenAddModal}
					pageData={pageData}
				/>
			</div>
		</PageContainer>
	);
};

export default Page;
