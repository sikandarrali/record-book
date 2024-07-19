"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Form, Formik } from "formik";
import {CalendarIcon, LockKeyhole, XIcon} from "lucide-react";
import {useLayoutEffect, useState} from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {useAuth} from "@/components/contexts/AuthContext";
import {Permission, Query, Role} from "appwrite";
import {useData} from "@/components/contexts/DataContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useScopedI18n} from "@/locales/client";
import {Label} from "@/components/ui/label";
import UIText from "@/components/theme/UIText";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {SheetStylesFlexibleHeight, SheetStylesMAxHeight90} from "@/lib/reusableStyles";
import {teams} from "@/components/appwrite/appwrite";
import {useRouter} from "next/navigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {FormattedDateForCalenderDatePick} from "@/lib/FormattedDateForCalendarPick";
import {FormattedDate} from "@/lib/hooks/FormattedDate";
import { Calendar } from "@/components/ui/calendar"

const EditEventSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	date: Yup.string().min(1).max(300, "max 300 characters"),
	venue: Yup.string().min(1).max(300, "max 300 characters"),
	details: Yup.string().min(1).max(300, "max 300 characters"),
});

export const EditEvent = ({ open, onOpenChange, eventData, setGroup }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const t = useScopedI18n('events')
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState()
	const [userJoinedGroups, setUserJoinedGroups] = useState([])
	const [userJoinedGroupName, setUserJoinedGroupName] = useState('')
	const {user} = useAuth()
	const router = useRouter()
	const [calendarOpen, setCalendarOpen] = useState(false);
	const {userOwnedGroups} = useData()

	let originalDate = eventData?.date;

	const isOwner = userOwnedGroups.some((grp)=> grp.$id === eventData?.teamId)

	const getUserGroups = async () =>{
		const response = await teams.list()
		setUserJoinedGroups(response.teams)
	}

	useLayoutEffect(() => {
		setUserJoinedGroupName(userJoinedGroups?.find((filter)=> filter.$id===eventData?.teamId)?.name)
		getUserGroups()
		if(eventData?.teamId) {
			setSelectedGroup(eventData?.teamId)
		}
	}, [open, router]);

	let teamPermissions = [
		Permission.read(Role.team(selectedGroup, "member")),
		Permission.update(Role.team(selectedGroup, "member")),
		Permission.delete(Role.team(selectedGroup, "member")),
		Permission.read(Role.user(user.$id)),
		Permission.update(Role.user(user.$id)),
		Permission.delete(Role.user(user.$id)),
	]
	let userPermissions = [
		Permission.read(Role.user(user.$id)),
		Permission.update(Role.user(user.$id)),
		Permission.delete(Role.user(user.$id)),
	]

	const updateAllItemsInEvent = async (permissionsToUpdate) => {
		const getItems = await db.eventItems.list([
			Query.orderDesc("$createdAt"),
			Query.equal('eventID', eventData?.$id)
		]);
		// Iterate over each document and delete it
		for (const item of getItems.documents) {

			let tempItem = {
				name: item?.name,
				details: item?.details,
				returned_amount: item?.returned_amount,
				eventID: item?.eventID,
				amount: item?.amount,
				date: item?.date,
			}
			await db.eventItems.update(tempItem, item.$id, permissionsToUpdate);
		}
	};

	const onUpdate = async (values) => {
		setAdding(true);
		setDisabled(true);

		if (
			values.name === eventData?.name &&
			values.date === eventData?.date &&
			values.venue === eventData?.venue &&
			values.details === eventData?.details &&
			values.teamId === eventData?.teamId &&
			values.date === eventData?.date
	) {
			toast.info(t('alertNothingToUpdate'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			return;
		}

		try {
			const eventDataValues = {
				name: values.name,
				date: values.date,
				venue: values.venue,
				details: values.details,
				teamId: selectedGroup,
			};

			if(selectedGroup){
				await db.events.update(eventDataValues, eventData?.$id, teamPermissions);
				await updateAllItemsInEvent(teamPermissions);
			}else{
				await db.events.update(eventDataValues, eventData?.$id, userPermissions);
				await updateAllItemsInEvent(userPermissions);
			}

			setGroup(userOwnedGroups.filter((item)=> item.$id === selectedGroup)[0])
			toast.success(t('alertEventUpdated'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			onOpenChange(false)
		} catch (error) {
			toast.error(t('alertException'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 outline-0 overflow-auto h-[90%] lg:h-screen lg:max-h-screen border-t-0 border-l-0")}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<UIText variant={'heading'} className="text-primary">
							{t('editEvent')}
						</UIText>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: eventData?.name,
								date: eventData?.date,
								venue: eventData?.venue,
								details: eventData?.details,
							}}
							validationSchema={EditEventSchema}
							onSubmit={(values) => {
								onUpdate(values);
							}}
						>
							{({
								errors,
								touched,
								values,
								handleChange,
								handleBlur,
								setFieldValue
							}) => (
								<Form className="flex flex-col w-full space-y-6">
									<div className="flex flex-col">
										<Label className={"relative text-sm flex items-center justify-between gap-4"}>
											<UIText variant={'label'} className="shrink-0">{t('labelShareWithGroup')}</UIText>
										</Label>
										{eventData?.teamId && !isOwner ?
											<UIText className={cn("p-3 border rounded-lg ltr:pr-6 rtl:pl-6 cursor-not-allowed", isStringUrdu(userJoinedGroupName) ? 'font-urdu' : 'font-sans')}>
												{userJoinedGroupName}
												<span className={'absolute rtl:left-4 ltr:right-4'}><LockKeyhole className={'text-destructive'}/> </span>
											</UIText>
											:
											<div className={'flex gap-4 items-center relative'}>
												<Select onValueChange={(selected)=> setSelectedGroup(selected)} key={selectedGroup}>
													<SelectTrigger className="w-full h-12 flex between" ref={null}>
														<UIText variant={'label'}>{selectedGroup ? userOwnedGroups.find((group)=> group.$id=== selectedGroup)?.name : <span className={'text-muted-foreground'}>{t('selectGroupPlaceholder')}</span>}</UIText>
													</SelectTrigger>
													<SelectContent>
														{userOwnedGroups.length===0 &&
															<SelectItem
																value={null}
															>
																<UIText className={'text-muted-foreground'} variant={'sm'}>{t('groupNotFound')}</UIText>
															</SelectItem>
														}
														{userOwnedGroups?.map((u)=>(
															<SelectItem
																key={u.$id}
																value={u.$id}
															>
																<UIText variant={'sm'}>{u.name}</UIText>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{selectedGroup &&
													<Button
														variant={'ghost'}
														type={'button'}
														size={'icon'}
														onClick={()=> setSelectedGroup(null)}
														className={'flex items-center justify-center text-primary hover:text-primary absolute right-1 bg-white'}
													>
														<XIcon className={'w-4 h-4'} />
													</Button>
												}
											</div>
										}
									</div>
									<div className="flex flex-col">
										<FormLabel
											title={t('labelName')}
											errors={errors.name}
											touched={touched.name}
										/>
										<UIText isUrdu={isStringUrdu(values.name)}>
											<Input
												onChange={handleChange}
												onBlur={handleBlur}
												name="name"
												disabled={disabled}
												value={values.name}
												className={cn(isStringUrdu(values.name) ? 'font-urdu' : 'font-sans')}
											/>
										</UIText>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title={t('labelDate')}
											errors={errors.date}
											touched={touched.date}
										/>
										<Popover
											open={calendarOpen}
											onOpenChange={setCalendarOpen}
										>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"w-full p-4 h-12 gap-4 justify-start text-left font-normal",
														!values.date &&
														"text-muted-foreground"
													)}
												>
													<CalendarIcon className=" h-4 w-4" />
													{values.date ?
														<UIText className={'rtl:font-sans'} variant={'xs'}>{new Date(values.date).toLocaleDateString()}</UIText>
														:
														<UIText className={'rtl:font-sans'} variant={'xs'}>{new Date(eventData?.date).toLocaleDateString()}</UIText>
													}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={values.date}
													onSelect={(selectedDate) => {
														setFieldValue("date", selectedDate);
														setCalendarOpen(false);
													}}
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title={t('labelVenue')}
											errors={errors.venue}
											touched={touched.venue}
										/>
										<UIText isUrdu={isStringUrdu(values.venue)}>
											<Input
												onChange={handleChange}
												onBlur={handleBlur}
												name="venue"
												disabled={disabled}
												value={values.venue}
												className={cn(isStringUrdu(values.venue) ? 'font-urdu' : 'font-sans')}
											/>
										</UIText>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title={t('labelDetails')}
											errors={errors.details}
											touched={touched.details}
										/>
										<UIText isUrdu={isStringUrdu(values.details)}>
											<Textarea
												onChange={handleChange}
												onBlur={handleBlur}
												name="details"
												disabled={disabled}
												value={values.details}
												className={cn(isStringUrdu(values.details) ? 'font-urdu' : 'font-sans')}
											/>
										</UIText>
									</div>

									<UISheetFooter
										adding={adding}
										disabled={disabled}
										onOpenChange={onOpenChange}
									/>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
