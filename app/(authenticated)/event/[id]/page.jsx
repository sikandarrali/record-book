"use client";
import { AddEventItem } from "@/components/event-items/AddEventItem";
import { SingleListItem } from "@/components/event-items/SingleListItem";
import EventInfo from "@/components/event/EventInfo";
import LoadingFallback from "@/components/loaders/LoadingFallback";
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyStore } from "@/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, XIcon } from "lucide-react";
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { NumericFormat } from "react-number-format";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {client} from "@/components/appwrite/appwrite";

const Page = ({ params }) => {
	const [searchValue, setSearchValue] = useState("");
	const [currentEvent, setCurrentEvent] = useState(null)
	const [eventItems, setEventItems] = useState([]);
	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [noItems, setNoItems] = useState(false);
	const [refreshItems, setRefreshItems] = useState(false)
	const [searchResultsMessage, setSearchResultsMessage] = useState('')

	const eventsStore = useMyStore((state) => state.events);
	const eventPageID = params.id;
	const [items, setItems] = useState([])
	const [itemsDefault, setItemsDefault] = useState([])

	useLayoutEffect(() => {
		const getEvent = eventsStore.some((item) => item.$id === eventPageID);
		if(!getEvent) redirect('/events')
	}, []);

	useEffect(() => {
		console.log(items)
	}, [items]);

	const getCurrentEvent = useCallback(
		(eventID) => {
			return eventsStore.find((event) => event.$id === eventID);
		},
		[eventsStore]
	);

	const getEventItems = async () =>{
		try {
			const response = await db.eventItems.list([
				Query.orderDesc("$createdAt"),
				Query.equal('eventID', params.id)
			]);
			if(response.documents.length === 0){
				setNoItems(true)
			}else{
				setItems(response.documents)
				setItemsDefault(response.documents)
				setNoItems(false)
			}
		} catch (error) {
			console.error("Error fetching event items:", error);
		}
	}
	useEffect(() => {
		getEventItems();
	}, []);

	// re-populate events when created, fixes missing $id issue
	useEffect(() => {
		const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS}.documents`, (response) => {
			if(response.events.includes("databases.*.collections.*.documents.*.create")){
				setItems(prev=> [response.payload, ...prev])
				setItemsDefault(prev=> [response.payload, ...prev])
				if(items.length > 0){
					setNoItems(false)
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

	const onSearch = (userValue) => {
		setSearchValue(userValue);
		if (userValue !== "") {
			const temp = itemsDefault?.filter((item) =>
				item.name.toLowerCase().includes(userValue.toLowerCase())
			);
			if(temp.length === 0){
				setSearchResultsMessage('No Items Matching your Search')
			}else{
				setSearchResultsMessage('')
			}
			setItems(temp);
		}else{
			resetSearch()
		}
	};

	useEffect(()=>{
		if(items.length > 0){
			setNoItems(false)
		}else{
			if(itemsDefault.length === 0){
				setNoItems(true)
			}
		}
	}, [items])

	const resetSearch = () =>{
		setSearchValue('')
		setItems(itemsDefault)
	}

	useEffect(() => {
		setCurrentEvent(getCurrentEvent(eventPageID))
	}, [eventsStore]);

	useEffect(() => {
		setTotalSum(eventItems?.reduce((acc, item) => acc + item.amount, 0));
	}, [eventItems]);

	return (
		<Suspense fallback={<LoadingFallback />}>
			<PageContainer hideNavbar>
				<div className="flex flex-col bg-primary text-background shadow-lg rounded-b-3xl -mx-6 gap-4 z-10">
					<div className="flex justify-between items-center h-16 w-full z-20 border-b border-primary-foreground/40 px-6">

						<Link href={"/events"} prefetch className={'p-1.5'}>
							<ArrowLeft />
						</Link>

						<div className="flex items-center gap-2 relative select-none pointer-events-none">
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

						{currentEvent &&
							<EventInfo
								eventData={currentEvent}
								sum={totalSum}
							/>
						}
					</div>

					<div className="pb-4 pt-1 flex flex-col justify-center items-center gap-4 select-none">
						<Text variant={"h1"} className="text-background px-6 text-center">
							<AnimatePresence>
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									{(getCurrentEvent(eventPageID))?.name}
								</motion.span>
							</AnimatePresence>
						</Text>
					</div>
				</div>

				<div className="flex flex-col pb-28 mt-6">
					<div className="relative h-14 mb-4">
						<Input
							className="text-[16px] h-full"
							placeholder="Type to search..."
							value={searchValue}
							onChange={(e) => onSearch(e.target.value)}
						/>

						{searchValue !== "" && (
							<XIcon
								className="w-4 h-4 text-primary absolute right-0 top-1/2 -translate-y-1/2 mr-3 cursor-pointer hover:scale-125 duration-300"
								onClick={() => resetSearch()}
							/>
						)}
					</div>

					<div
						className="flex flex-col divide-y -mx-6"
						// ref={scrollRef}
					>
						{noItems && searchValue === '' && items.length===0 && (
							<div className="flex flex-col justify-center items-center gap-10 px-6 mt-10">
								<p className="text-center text-lg font-medium">
									No Data Found
								</p>

								<Button
									size="lg"
									onClick={() => setOpenAddModal(true)}
								>
									Add New Data
								</Button>
							</div>
						)}

						{searchValue !== '' && searchResultsMessage !== '' && (
							<div className="flex flex-col justify-center items-center gap-10 px-6 mt-10">
								<p className="text-center text-lg font-medium">
									{searchResultsMessage}
								</p>
							</div>
						)}

						{items.map(
							(item, i) => (
								<motion.div
									initial={{ opacity: 0, y: 5 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: { delay: 0.00002 + i / 10 },
									}}
									key={i + item.name}
								>
									<SingleListItem item={item}/>
								</motion.div>
							)
						)}
					</div>
				</div>

				<div
					className="fixed bottom-8 cursor-pointer right-8 z-10 w-[4.5rem] h-[4.5rem] flex items-center justify-center rounded-full bg-primary"
					onClick={() => setOpenAddModal(true)}
				>
					<Plus className="text-white w-10 h-10" />
				</div>

				<AddEventItem
					open={openAddModal}
					onOpenChange={setOpenAddModal}
					eventID={eventPageID}
					refreshItems={refreshItems}
					setRefreshItems={setRefreshItems}
				/>
			</PageContainer>
		</Suspense>
	);
};

export default Page;
