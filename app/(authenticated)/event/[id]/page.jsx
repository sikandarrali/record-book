"use client";
import { useData } from "@/components/contexts/DataContext";
import { AddEventItem } from "@/components/event-items/AddEventItem";
import { SingleListItem } from "@/components/event-items/SingleListItem";
import EventInfo from "@/components/event/EventInfo";
import LoadingFallback from "@/components/loaders/LoadingFallback";
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FixStickyHeaderScrollError } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";

const Page = ({ params }) => {
	const [value, setValue] = useState("");
	const [currentEvent, setCurrentEvent] = useState(null)
	const [eventItems, setEventItems] = useState([]);
	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [openEventDetails, setOpenEventDetails] = useState(false);
	const [openEditEventDetails, setOpenEditEventDetails] = useState(false);
	const [loading, setLoading] = useState(true);
	const [noItems, setNoItems] = useState(false);
	const router = useRouter();

	const { getCurrentEvent } = useData();

	const eventsStore = useMyStore((state) => state.events);
	const eventItemsStore = useMyStore((state) => state.eventItems);
	const deleteAllItems = useMyStore((state) => state.emptyEventItems);

	const populateItems = () =>{
		const filter = eventItemsStore.filter(
			(item) => item.eventID === params.id
		);
		setEventItems(filter);

		if (filter.length === 0) {
			setNoItems(true);
		}
	}

	useEffect(() => {
		if(!openAddModal){ // updates store list items when adding new
			populateItems()
		}
	}, [eventItemsStore, openAddModal, params.id]);

	const onSearch = (userValue) => {
		setValue(userValue);
		if (userValue !== "") {
			const temp = eventItems?.filter((item) =>
				item.name.toLowerCase().includes(userValue.toLowerCase())
			);
			setEventItems(temp);
		} else {
			populateItems()
		}
	};

	useEffect(() => {
		setCurrentEvent(getCurrentEvent(params.id))
	}, [eventsStore]);

	useEffect(() => {
		setTotalSum(eventItems?.reduce((acc, item) => acc + item.amount, 0));
	}, [eventItems]);

	// // fixes warning: Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element
	// const scrollRef = useRef(null);
	// useEffect(() => {
	// 	FixStickyHeaderScrollError(scrollRef);
	// }, [eventItems]);

	return (
		<Suspense fallback={<LoadingFallback />}>
			<PageContainer hideNavbar>
				<div className="flex flex-col bg-primary text-background shadow-lg rounded-b-3xl -mx-6 gap-4 sticky -top-14 z-10">
					<div className="flex justify-between items-center h-14 w-full z-20 border-b border-primary-foreground/40 px-6">
						<Link href={"/events"} prefetch>
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

					<div className="pb-4 flex flex-col justify-center items-center gap-4 select-none">
						<Text variant={"h2"} className="text-background px-6 text-center">
							<AnimatePresence>
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									{(getCurrentEvent(params.id))?.name}
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
							value={value}
							onChange={(e) => onSearch(e.target.value)}
						/>

						{value !== "" && (
							<XIcon
								className="w-4 h-4 text-primary absolute right-0 top-1/2 -translate-y-1/2 mr-3 cursor-pointer hover:scale-125 duration-300"
								onClick={() => setEventItems()}
							/>
						)}
					</div>

					<div
						className="flex flex-col divide-y -mx-6"
						// ref={scrollRef}
					>
						{noItems ? (
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
						) : (
							eventItems?.map(
								(item, i) => (
									<motion.div
										initial={{ opacity: 0, y: 5 }}
										animate={{
											opacity: 1,
											y: 0,
											transition: { delay: 0.3 + i / 10 },
										}}
										key={i + item.name}
									>
										<SingleListItem
											item={item}
											eventItems={eventItems}
											setEventItems={setEventItems}
										/>
									</motion.div>
								)
								// ) : (
								// 	<div className="flex flex-col">
								// 		{[1, 2, 3, 4, 5].map((item) => (
								// 			<ItemsSkeleton key={item} />
								// 		))}
								// 	</div>
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
					onOpen={setOpenAddModal}
					eventID={params.id}
				/>
			</PageContainer>
		</Suspense>
	);
};

export default Page;
