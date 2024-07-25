"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Form, Formik } from "formik";
import {CalendarIcon, ChevronDown, ChevronUp, LockKeyhole, XIcon} from "lucide-react";
import {useEffect, useLayoutEffect, useState} from "react";
import { useMediaQuery } from "react-responsive";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {useAuth} from "@/components/contexts/AuthContext";
import {Query} from "appwrite";
import {useData} from "@/components/contexts/DataContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useI18n} from "@/locales/client";
import {Label} from "@/components/ui/label";
import UIText from "@/components/theme/UIText";
import {
	COLLECTION_ID_PAGES,
	DATABASE_ID,
	databases,
	PARENT_FIELD_IN_SINGLE_RECORD
} from "@/components/appwrite/appwrite";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {PageSchema} from "@/lib/schemas/pageSchema";

export const EditPage = ({ open, onOpenChange, pageData, setPageData, setGroup }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const t = useI18n()
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState()
	const [selectedGroupName, setSelectedGroupName] = useState('')
	const [userJoinedGroupName, setUserJoinedGroupName] = useState('')
	const {user} = useAuth()
	const [calendarOpen, setCalendarOpen] = useState(false);
	const {userOwnedGroups, userGroups} = useData()
	const [addEventDetails, setAddEventDetails] = useState(false)

	let defaultTeamId = pageData?.teamId;

	const isOwner = userOwnedGroups.some((grp)=> grp.$id === pageData?.teamId)

	useLayoutEffect(() => {
		setUserJoinedGroupName(userGroups?.find((filter)=> filter.$id===pageData?.teamId)?.name)
		if(pageData?.teamId) {
			setSelectedGroup(pageData?.teamId)
		}
	}, [open]);

	const updateAllItemsInEvent = async () => {
		const getItems = await db.records.list([
			Query.orderDesc("$createdAt"),
			Query.equal(PARENT_FIELD_IN_SINGLE_RECORD, pageData?.$id)
		]);
		// Iterate over each document and delete it
		for (const item of getItems.documents) {
			let tempItem = {
				name: item?.name,
				details: item?.details,
				type: item?.type,
				[PARENT_FIELD_IN_SINGLE_RECORD]: item?.pageId,
				amount: item?.amount,
				date: item?.date,
			}
			await db.records.update(tempItem, item.$id);
		}
	};

	const onUpdate = async (values) => {

		setAdding(true);
		setDisabled(true);

		const tempUpdatedBy = [user?.name, user?.email];

		try {
			const pageDataValues = {
				name: values.name.trim(),
				date: values.date,
				details: values.details.trim(),
				teamId: selectedGroup,
				createdBy: pageData.createdBy,
				updatedBy: tempUpdatedBy
			};

			if(selectedGroup){
				const result = await databases.updateDocument(
					DATABASE_ID,
					COLLECTION_ID_PAGES,
					pageData?.$id,
					pageDataValues
				);
				setPageData(result)
				if(defaultTeamId !== selectedGroup){
					await updateAllItemsInEvent();
				}
			}else{
				const result = await databases.updateDocument(
					DATABASE_ID,
					COLLECTION_ID_PAGES,
					pageData?.$id,
					pageDataValues
				);
				setPageData(result)
				if(defaultTeamId){
					await updateAllItemsInEvent();
				}
			}

			setGroup(userOwnedGroups.find((item)=> item.$id === selectedGroup))
			toast.success(t('alerts.updated'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			onOpenChange(false)
		} catch (error) {
			toast.error(t('alerts.exception'), ToastOptions);
			console.log(error)
			setAdding(false);
			setDisabled(false);
		}
	};

	useEffect(() => {
		if(selectedGroup){
			const groupByID = userOwnedGroups.find((g)=> g.$id === selectedGroup);
			setSelectedGroupName(groupByID?.name)
		}
	}, [selectedGroup]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 outline-0 overflow-auto h-[90%] lg:h-screen lg:max-h-screen border-t-0 border-l-0")}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">

					<UIText
						variant={'heading'}
						className="text-primary mb-4"
						text={t('pages.home.editPage')}
					/>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: pageData?.name,
								date: pageData?.date,
								details: pageData?.details,
								// type: pageData?.type
							}}
							validationSchema={PageSchema}
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
									<div className="flex flex-col gap-2">
										<Label className={"relative text-sm flex items-center justify-between gap-4"}>
											<UIText variant={'label'} className="shrink-0" text={t('labels.shareWithGroup')}/>
										</Label>
										{pageData?.teamId && !isOwner ?
											<div className={cn("flex justify-betweenp-3 border rounded-lg p-6 cursor-not-allowed")}>
												<UIText text={userJoinedGroupName} className={'ltr:pr-14 rtl:pl-14'}/>
												<span className={'absolute rtl:left-10 ltr:right-10'}><LockKeyhole className={'text-destructive'}/> </span>
											</div>
											:
											<div className={'flex gap-4 items-center relative'}>
												<Select onValueChange={(selected)=> {
													setSelectedGroup(selected);
													console.log(selected)
												}} key={selectedGroup}>
													<SelectTrigger ref={null} className="w-full min-h-16 py-4 flex between rtl:flex-row-reverse">
														{selectedGroup ?
															<UIText text={selectedGroupName}/>
															:
															<UIText className={"text-muted-foreground rtl:pr-4"} text={t('labels.selectGroup')}/>
														}
													</SelectTrigger>
													<SelectContent>
														{userOwnedGroups.length===0 &&
															<SelectItem value={null}>
																<UIText className={'text-muted-foreground'} variant={'sm'} text={t('labels.noGroups')}/>
															</SelectItem>
														}
														{userOwnedGroups?.map((u)=>(
															<SelectItem
																key={u.$id}
																value={u.$id}
															>
																<UIText variant={'sm'} text={u.name}/>
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
														className={'flex items-center justify-center text-primary hover:text-primary absolute ltr:right-1 rtl:left-1 bg-white'}
													>
														<XIcon className={'w-4 h-4'} />
													</Button>
												}
											</div>
										}
									</div>

									<div className="flex flex-col">
										<FormLabel
											title={t('labels.name')}
											errors={errors.name}
											touched={touched.name}
										/>
										<UITextInput
											onChange={handleChange}
											onBlur={handleBlur}
											name="name"
											disabled={disabled}
											value={values.name}
										/>
									</div>

									<div
										className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary'}
										onClick={()=> setAddEventDetails(!addEventDetails)}
									>
										<UIText variant={'sm'} className={'font-medium'} text={t('labels.addMoreDetails')}/>
										{addEventDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2'}/>}
									</div>

									{addEventDetails &&
										<>
											<div className="flex flex-col">
												<FormLabel
													title={t('labels.date')}
													errors={errors.date}
													touched={touched.date}
												/>
												<div className={'flex gap-4 items-center'}>
													<Popover
														open={calendarOpen}
														onOpenChange={setCalendarOpen}
													>
														<PopoverTrigger asChild>
															<Button
																variant={"outline"}
																className={cn(
																	"w-full p-4 gap-4 justify-start text-left font-normal",
																	!values.date &&
																	"text-muted-foreground"
																)}
															>
																<CalendarIcon className=" h-4 w-4" />
																{values.date ?
																	<UIText className={'rtl:font-sans'} weight={'medium'} text={new Date(values.date).toLocaleDateString()}/>
																	:
																	<UIText weight={'medium'} text={t('labels.pickDate')}/>
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

													{/* Clear Date Button */}
													{values.date &&
														<Button
															variant={'outline'}
															type={'button'}
															size={'icon'}
															onClick={()=> setFieldValue("date", "")}
															className={'!w-10 !h-10 px-2 flex items-center justify-center text-destructive stroke-[2.5] hover:text-destructive'}
														>
															<XIcon className={'w-4 h-4'} />
														</Button>
													}
												</div>
											</div>

											<div className="flex flex-col">
												<FormLabel
													title={t('labels.details')}
													errors={errors.details}
													touched={touched.details}
												/>
												<UITextArea
													onChange={handleChange}
													onBlur={handleBlur}
													name="details"
													disabled={disabled}
													value={values.details}
												/>
											</div>

										</>
									}

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
