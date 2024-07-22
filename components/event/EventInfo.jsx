import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {Info, Pen, SquarePen, Trash2, XIcon} from "lucide-react";
import { useRouter } from "next/navigation";
import {useLayoutEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { DeleteEvent } from "./DeleteEvent";
import { EditEvent } from "./EditEvent";
import {db} from "@/components/appwrite/database";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import {Query} from "appwrite";
import {cn} from "@/lib/utils";
import {useMediaQuery} from "react-responsive";
import {getGroup} from "@/components/appwrite/appwrite";
import {useScopedI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {FormattedDateForCalenderDatePick} from "@/lib/FormattedDateForCalendarPick";
import {FormattedDate} from "@/lib/hooks/FormattedDate";
import {useData} from "@/components/contexts/DataContext";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

const EventInfo = ({ eventData, setEventData, sum }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();
	const [group, setGroup] = useState(null)
	const t = useScopedI18n('events')
	const tMonths = useScopedI18n('months')
	const tGeneral = useScopedI18n('general')
	const {userOwnedGroups, userGroups} = useData()

	const onDelete = async () => {
		await db.events.delete(eventData?.$id);
		await DeleteAllItemsInThisEvent()
		setOpenDelete(false);
		setOpenDetails(false);
		toast.success(t('alertEventDeleted'), ToastOptions);
		router.replace("/events");
	};

	const DeleteAllItemsInThisEvent = async () => {
		const getItems = await db.eventItems.list([
			Query.orderDesc("$createdAt"),
			Query.equal('eventID', eventData?.$id)
		]);
		// Iterate over each document and delete it
		for (const item of getItems.documents) {
			await db.eventItems.delete(item.$id);
		}
	};

	// set group
	useLayoutEffect(() => {
		const unsub = async () =>{
			if(eventData?.teamId){
				const response = userGroups.find((item)=> item.$id === eventData?.teamId)
				setGroup(response)
			}else{
				setGroup(null)
			}
		}
		unsub()
	}, [openDetails]);


	// Parse the date string
	const date = new Date(eventData?.date);
	const year = date.getFullYear();
	const day = date.getDate();
	const monthIndex = date.getMonth(); // getMonth() returns a zero-based index (0 for January, 11 for December)
	const month = months[monthIndex];


	return (
		<>
			<Button
				variant="ghost"
				className={'w-14'}
				onClick={() => setOpenDetails(true)}
				dir={'ltr'}
			>
				<SquarePen className={'w-6 h-6 text-primary'} />
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

						<div className="flex flex-col justify-center items-center gap-5 my-10 lg:mt-32">
							<UIText variant={"heading"} text={eventData?.name}/>

							<div className="flex flex-1 justify-center col-span-4 items-center gap-2 relative select-none pointer-events-none" dir={'ltr'}>
								<span className="text-sm font-semibold">Rs</span>
								<span className="font-bold text-3xl text-primary">
									<NumericFormat
										allowNegative={false}
										value={Number(sum)}
										thousandSeparator={","}
										decimalSeparator={"."}
										displayType="text"
										decimalScale={2}
									/>
								</span>
							</div>
						</div>

						<Table className={'lg:mt-16'}>
							<TableBody className="font-medium text-base">
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText className={'text-muted-foreground'} text={t('labelGroup')}/></TableCell>
									<TableCell>
										<UIText
											variant={'label'}
											text={group?.name || t('notSharedWithGroup')}
										/>
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText className={'text-muted-foreground'} text={t('labelDate')}/></TableCell>
									<TableCell>
										{eventData?.date ? <UIText text={`${day} ${tMonths(month.toLowerCase())+tGeneral('comma')} ${year}`}/> : '-'}
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText className={'text-muted-foreground'} text={t('labelVenue')}/></TableCell>
									<TableCell>
										<UIText text={eventData?.venue || '-'}/>
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText className={'text-muted-foreground'} text={t('labelDetails')}/></TableCell>
									<TableCell>
										<UIText text={eventData?.details || '-'}/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>

						<UISheetInfoFooter
							setOpen={setOpenDetails}
							setOpenDelete={setOpenDelete}
							setOpenEdit={setOpenEdit}
						/>

					</div>
				</SheetContent>
			</Sheet>

			<EditEvent
				open={openEdit}
				onOpenChange={setOpenEdit}
				eventData={eventData}
				setEventData={setEventData}
				setGroup={setGroup}
			/>
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
