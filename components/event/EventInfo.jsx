import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { Info, Pen, Trash2, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {useEffect, useLayoutEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { DeleteEvent } from "./DeleteEvent";
import { EditEvent } from "./EditEvent";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import {Query} from "appwrite";
import {cn} from "@/lib/utils";
import {useMediaQuery} from "react-responsive";
import {getGroup} from "@/components/appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";

const EventInfo = ({ eventData, sum }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();
	const [group, setGroup] = useState(null)
	const {user} = useAuth()

	const deleteEventStore = useMyStore((state) => state.deleteEvent);

	const onDelete = async () => {
		await db.events.delete(eventData?.$id);
		await DeleteAllItemsInThisEvent()
		deleteEventStore(eventData?.$id);
		setOpenDelete(false);
		setOpenDetails(false);
		toast.success("Deleted!", ToastOptions);
		router.replace("/events");
	};

	const DeleteAllItemsInThisEvent = async () => {
		let items = []
		const getItems = await db.eventItems.list([
			Query.orderDesc("$createdAt"),
			Query.equal('eventID', eventData?.$id)
		]);
		// Iterate over each document and delete it
		for (const item of getItems.documents) {
			await db.eventItems.delete(item.$id);
		}
	};

	useLayoutEffect(() => {
		const unsub = async () =>{
			if(eventData?.teamId){
				const response = await getGroup(eventData.teamId)
				setGroup(response)
			}
		}
		return ()=> unsub()
	}, []);


	return (
		<>
			<Button variant="ghost" size="icon" onClick={() => setOpenDetails(true)}>
				<Info/>
			</Button>

			<Sheet
				open={openDetails}
				onOpenChange={setOpenDetails}
				defaultOpen={false}
			>
				<SheetContent
					className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
					side={isDesktop ? "right" : "bottom"}
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>

					<div className="flex flex-col w-full min-h-full pt-4 justify-start">

						<div className="flex flex-col justify-center items-center my-10 lg:mt-32">
							<Text
								variant={"h1"}
								className="text-primary text-center self-center"
							>
								{eventData?.name}
							</Text>
							<p className="font-semibold text-3xl">
								<NumericFormat
									allowNegative={false}
									value={Number(sum)}
									thousandSeparator={","}
									decimalSeparator={"."}
									displayType="text"
									decimalScale={2}
								/>
							</p>
						</div>

						<Table className={'lg:mt-16'}>
							<TableBody className="font-medium text-base">
								<TableRow className={'border-b-muted'}>
									<TableCell>Group</TableCell>
									<TableCell className="text-right">
										{group?.name || <p>Not Shared<br className={'flex md:hidden'}/>with any Group</p>}
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell>Date</TableCell>
									<TableCell className="text-right">
										{eventData?.date || '-'}
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell>Venue</TableCell>
									<TableCell className="text-right">
										{eventData?.venue || '-'}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>

						<div className={'mt-auto py-14 lg:py-0 flex flex-row items-center justify-between px-2'}>
							<div className={"flex flex-row justify-end gap-4"}>
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
						</div>
					</div>
				</SheetContent>
			</Sheet>

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
