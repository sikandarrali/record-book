import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import { Info, Pen, Trash2, XIcon } from "lucide-react";
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

const EventInfo = ({ eventData, sum, userOwnedGroups }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();
	const [group, setGroup] = useState(null)
	const t = useScopedI18n('events')
	const tMonths = useScopedI18n('months')

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
			if(eventData.teamId){
				const response = await getGroup(eventData.teamId)
				setGroup(response)
			}
		}
		unsub()
	}, []);


	// Parse the date string
	const date = new Date(eventData?.date);
	const year = date.getFullYear();
	const day = date.getDate();
	const monthIndex = date.getMonth(); // getMonth() returns a zero-based index (0 for January, 11 for December)
	const month = months[monthIndex];


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

						<div className="flex flex-col justify-center items-center gap-5 my-10 lg:mt-32">
							<UIText
								variant={"heading"}
								className={cn(
									"text-primary text-center self-center",
									isStringUrdu(eventData?.name) ? 'font-urdu' : 'rtl:font-sans font-medium',
								)}
							>
								{eventData?.name}
							</UIText>
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
									<TableCell><UIText>{t('labelGroup')}</UIText></TableCell>
									<TableCell className="text-right">
										<UIText isUrdu={isStringUrdu(group?.name)}>
											{group?.name || <p className={'italic text-muted-foreground text-sm'}>Not Shared<br className={'flex md:hidden'}/>with any Group</p>}
										</UIText>
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText>{t('labelDate')}</UIText></TableCell>
									<TableCell className="text-right">
										<p className={'flex gap-0.5 rtl:gap-2 items-center rtl:justify-end flex-row-reverse'}>
											{eventData.date ?
												<>
													<UIText className={'rtl:font-sans'}>{year}</UIText>
													<span className={'w-2 h-0.5 bg-foreground rtl:hidden'}/>
													<UIText>{tMonths(month.toLowerCase())}</UIText>
													<span className={'w-2 h-0.5 bg-foreground rtl:hidden'}/>
													<UIText className={'rtl:font-sans'}>{day}</UIText>
												</>
												: '-'
											}
										</p>
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText>{t('labelVenue')}</UIText></TableCell>
									<TableCell className="text-right">
										<UIText isUrdu={isStringUrdu(group?.venue)}>{eventData?.venue || '-'}</UIText>
									</TableCell>
								</TableRow>
								<TableRow className={'border-b-muted'}>
									<TableCell><UIText>{t('labelDetails')}</UIText></TableCell>
									<TableCell className="text-right">
										<UIText isUrdu={isStringUrdu(group?.details)}>{eventData?.details || '-'}</UIText>
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

			<EditEvent open={openEdit} onOpenChange={setOpenEdit} eventData={eventData} setGroup={setGroup} userOwnedGroups={userOwnedGroups} />
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
