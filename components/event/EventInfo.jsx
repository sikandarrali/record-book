import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {Info, LockKeyhole, Pen, SquarePen, Trash2, Users2, XIcon} from "lucide-react";
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
import {useScopedI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

import {useData} from "@/components/contexts/DataContext";
import {EnglishMonths} from "@/lib/defaultData";
import {useAuth} from "@/components/contexts/AuthContext";

const EventInfo = ({ eventData, setEventData, sum }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();
	const [group, setGroup] = useState(null)
	const tEvents = useScopedI18n('events')
	const t = useScopedI18n('events.eventInfo')
	const tMonths = useScopedI18n('months')
	const tGeneral = useScopedI18n('general')
	const {userGroups} = useData()
	const {user} = useAuth()

	const hasDeletePermission =  eventData.$permissions.some(permission => permission === `delete("user:${user.$id}")`)

	const onDelete = async () => {
		await db.events.delete(eventData?.$id);
		await DeleteAllItemsInThisEvent()
		setOpenDelete(false);
		setOpenDetails(false);
		toast.success(tEvents('alertEventDeleted'), ToastOptions);
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
	const month = EnglishMonths[monthIndex];

	const createdAtDate = new Date(eventData.$createdAt);
	const renderedCreatedDate = {
		year: createdAtDate.getFullYear(),
		day: createdAtDate.getDate(),
		month: EnglishMonths[createdAtDate.getMonth()],
		hours: String(createdAtDate.getHours()).padStart(2, '0'),
		minutes: String(createdAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(createdAtDate.getSeconds()).padStart(2, '0')
	}

	const updatedAtDate = new Date(eventData.$updatedAt);
	const renderedUpdatedDate = {
		year: updatedAtDate.getFullYear(),
		day: updatedAtDate.getDate(),
		month: EnglishMonths[updatedAtDate.getMonth()],
		hours: String(updatedAtDate.getHours()).padStart(2, '0'),
		minutes: String(updatedAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(updatedAtDate.getSeconds()).padStart(2, '0')
	}

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
					className={cn("pb-40 lg:pb-14 outline-0 overflow-auto h-[90%] lg:h-screen lg:max-h-screen border-t-0 border-l-0")}
					side={isDesktop ? "right" : "bottom"}
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>

					<div className="flex flex-col w-full min-h-full pt-4 justify-start">

						<div className={'flex items-center justify-between gap-4 text-primary'}>
							{eventData.$permissions.some(permission => permission === `delete("user:${user.$id}")`) && <LockKeyhole className={'w-5 h-5'}/>}
							<div/> {/*empty div fixes justify between*/}
							{eventData.teamId && <Users2 className={'w-5 h-5'}/>}
						</div>


						<div className="flex flex-col justify-center text-center items-center gap-5 mt-5 mb-10 lg:mt-32">
							<UIText variant={"heading"} text={eventData?.name} className={'break-all'}/>

							<div className="flex flex-1 justify-center col-span-4 items-center gap-2 relative select-none pointer-events-none" dir={'ltr'}>
								<span className="text-sm font-semibold">Rs</span>
								<UIText
									className="text-primary"
									weight={'semibold'}
									variant={'heading'}
									text={
										<NumericFormat
											allowNegative={false}
											value={Number(sum)}
											thousandSeparator={","}
											decimalSeparator={"."}
											displayType="text"
											decimalScale={2}
										/>
									}
								/>
							</div>
						</div>


						<div className={'flex flex-col divide-y lg:mt-16'}>
							<div className={'flex py-2 items-center'}>
								<div className={'w-1/4 flex shrink-0'}>
									<UIText weight={'medium'} className={'text-muted-foreground'} text={t('labelGroup')}/>
								</div>
								<div className={'w-3/4 flex items-center pl-4'}>
									{group?.name ?
										<UIText variant={'label'} className={'text-primary'} text={group?.name}/>
										:
										<UIText variant={'label'} text={t('notSharedWithGroup')}/>
									}
								</div>
							</div>

							<div className={'flex py-2 items-center'}>
								<div className={'w-1/4 flex shrink-0'}>
									<UIText weight={'medium'} className={'text-muted-foreground'} text={t('labelDate')}/>
								</div>
								<div className={'w-3/4 flex items-center pl-4'}>
									{eventData?.date ? <UIText text={`${day} ${tMonths(month.toLowerCase())+tGeneral('comma')} ${year}`}/> : '-'}
								</div>
							</div>

							<div className={'flex py-2 items-center'}>
								<div className={'w-1/4 flex shrink-0'}>
									<UIText weight={'medium'} className={'text-muted-foreground'} text={t('labelVenue')}/>
								</div>
								<div className={'w-3/4 flex items-center pl-4'}>
									<UIText text={eventData?.venue || '-'}/>
								</div>
							</div>

							<div className={'flex py-2 items-center'}>
								<div className={'w-1/4 flex shrink-0'}>
									<UIText weight={'medium'} className={'text-muted-foreground'} text={t('labelDetails')}/>
								</div>
								<div className={'w-3/4 flex items-center pl-4'}>
									<UIText text={eventData?.details || '-'}/>
								</div>
							</div>

							<Accordion type="single" collapsible>
								<AccordionItem value="item-1" className={'border-0'}>
									<AccordionTrigger className={'text-muted-foreground hover:no-underline'}>
										<UIText weight={'medium'} text={t('labelViewCreatedEditedBy')}/>
									</AccordionTrigger>

									<AccordionContent className={'divide-y'}>
										<div className={'flex py-4'}>
											<div className={'w-1/4 flex flex-col shrink-0'}>
												<UIText weight={'medium'} className={'text-muted-foreground'} variant={'sm'} text={t('addedBy')}/>
											</div>
											<div className={'w-3/4 flex flex-col pl-4'}>
												<UIText variant={'sm'} weight={'semibold'} className={'!text-left'} text={eventData?.createdBy[0] || '-'}/>
												<UIText variant={'xs'} text={eventData?.createdBy[1] || '-'}/>
												<p className={'flex flex-wrap rtl:justify-end items-center gap-2 mt-2 text-muted-foreground'}>
													<UIText variant={'xs'} weight={'medium'} className={'order-1 rtl:order-2'} text={t('onDay')}/>
													<UIText variant={'xs'} weight={'medium'} className={'order-2 rtl:order-1'} text={`${renderedCreatedDate.day} ${tMonths(renderedCreatedDate.month.toLowerCase())+tGeneral('comma')} ${renderedCreatedDate.year}`}/>
													<UIText variant={'xs'} weight={'medium'} className={'order-3 rtl:order-4'} text={t('atTime')}/>
													<UIText variant={'xs'} weight={'medium'} className={'order-4 rtl:order-3 rtl:mt-2'} text={`${renderedCreatedDate.hours}:${renderedCreatedDate.minutes}:${renderedCreatedDate.minutes}`}/>
												</p>
											</div>
										</div>
										{eventData?.updatedBy[0] &&
											<div className={'flex py-4'}>
												<div className={'w-1/4 flex flex-col shrink-0'}>
													<UIText weight={'medium'} className={'text-muted-foreground'} variant={'sm'} text={t('updatedBy')}/>
												</div>
												<div className={'w-3/4 flex flex-col pl-4'}>
													<UIText variant={'sm'} weight={'semibold'} text={eventData?.updatedBy[0] || '-'}/>
													<UIText variant={'xs'} text={eventData?.updatedBy[1] || '-'}/>
													<p className={'flex flex-wrap rtl:justify-end items-center gap-2 mt-2 text-muted-foreground'}>
														<UIText variant={'xs'} weight={'medium'} className={'order-1 rtl:order-2'} text={t('onDay')}/>
														<UIText variant={'xs'} weight={'medium'} className={'order-2 rtl:order-1'} text={`${renderedUpdatedDate.day} ${tMonths(renderedUpdatedDate.month.toLowerCase())+tGeneral('comma')} ${renderedUpdatedDate.year}`}/>
														<UIText variant={'xs'} weight={'medium'} className={'order-3 rtl:order-4'} text={t('atTime')}/>
														<UIText variant={'xs'} weight={'medium'} className={'order-4 rtl:order-3 rtl:mt-2'} text={`${renderedUpdatedDate.hours}:${renderedUpdatedDate.minutes}:${renderedUpdatedDate.minutes}`}/>
													</p>
												</div>
											</div>
										}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>

						<UISheetInfoFooter
							setOpen={setOpenDetails}
							setOpenDelete={setOpenDelete}
							setOpenEdit={setOpenEdit}
							hasDeletePermission={hasDeletePermission}
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
			{hasDeletePermission &&
				<DeleteEvent
					open={openDelete}
					onOpenChange={setOpenDelete}
					onDelete={onDelete}
					eventName={eventData?.name}
				/>
			}
		</>
	);
};

export default EventInfo;
