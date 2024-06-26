import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { Info, Pen, Trash2, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { DeleteEvent } from "./DeleteEvent";
import { EditEvent } from "./EditEvent";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"

const EventInfo = ({ eventData, sum }) => {
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();

	const deleteEventStore = useMyStore((state) => state.deleteEvent);

	const onDelete = async () => {
		await db.events.delete(eventData?.$id);
		deleteEventStore(eventData?.$id);
		setOpenDelete(false);
		setOpenDetails(false);
		toast.success("Deleted!", ToastOptions);
		router.replace("/events");
	};


	// const DeleteAllItemsInThisEvent = async () => {
	// 	const promises = [];
	// 	const getItems = await db.eventItems.list([
	// 		Query.orderDesc("$createdAt"),
	// 		Query.equal('eventID', deleteID)
	// 	]);
	// 	items = getItems.documents;
	//
	//
	// };

	// fixes dialog adding pointer-events:none to body
	// document.body.style.pointerEvents = "auto";
	useEffect(() => {
		if (openDetails) {
			// Pushing the change to the end of the call stack
			const timer = setTimeout(() => {
				document.body.style.pointerEvents = "";
			}, 0);
			return () => clearTimeout(timer);
		} else {
			document.body.style.pointerEvents = "auto";
		}
	}, [openDetails]);

	return (
		<>
			<div className="font-semibold" onClick={() => setOpenDetails(true)}>
				<Info className="cursor-pointer hover:scale-125 duration-300 text-background" />
			</div>

			<Drawer
				onRelease={()=> setOpenDetails(false)}
				open={openDetails}
				onOpen={setOpenDetails}
			>
				<DrawerContent className={'p-6'}>
					<div className={'hidden'}>
						<DrawerHeader className={'mb-0 px-0 pb-0.5 pt-0'}>
							<DrawerTitle/><DrawerDescription/>
						</DrawerHeader>
					</div>

					<div className="flex gap-4 mt-16 mb-16 text-center justify-center">
						<Text
							variant={"h1"}
							className="text-primary text-center self-center"
						>
							{eventData?.name}
						</Text>
					</div>

					<Table>
						<TableBody className="font-medium text-base">
							<TableRow className={'border-b-muted'}>
								<TableCell>Total</TableCell>
								<TableCell className="text-right text-primary font-semibold text-xl">
									<NumericFormat
										allowNegative={false}
										value={Number(sum)}
										thousandSeparator={","}
										decimalSeparator={"."}
										displayType="text"
										decimalScale={2}
									/>
								</TableCell>
							</TableRow>
							<TableRow className={'border-b-muted'}>
								<TableCell>Date</TableCell>
								<TableCell className="text-right">
									{eventData?.date}
								</TableCell>
							</TableRow>
							<TableRow className={'border-b-muted'}>
								<TableCell>Venue</TableCell>
								<TableCell className="text-right">
									{eventData?.venue}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<DrawerFooter className={'mb-10 mt-10 flex flex-row items-center justify-between px-2'}>

						<div
							className={
								"flex flex-row justify-end gap-4"
							}
						>
							<Button
								type="submit"
								variant="outline"
								size="icon"
								onClick={() => setOpenDelete(true)}
							>
								<Trash2 className="h-5 w-5 text-primary" />
							</Button>
							<Button
								type="submit"
								variant="outline"
								size="icon"
								onClick={() => setOpenEdit(true)}
							>
								<Pen className="h-4 w-4" />
							</Button>
						</div>

						<Button
							type="submit"
							variant="outline"
							size="icon"
							// stretched
							className="w-14 h-14 rounded-full self-center"
							onClick={() => setOpenDetails(false)}
						>
							<XIcon className="text-primary" />
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<EditEvent open={openEdit} onOpenChange={setOpenEdit} eventData={eventData} />
			<DeleteEvent
				open={openDelete}
				onOpenChange={setOpenDelete}
				onDelete={onDelete}
				eventName={eventData?.name}
			/>
		</>
	);
};

export default EventInfo;
