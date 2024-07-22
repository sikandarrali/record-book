"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn, scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import {CalendarIcon, ChevronDown, ChevronUp, Plus, XIcon} from "lucide-react";
import {useEffect, useState} from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Permission, Role} from "appwrite";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select"
import {useAuth} from "@/components/contexts/AuthContext";
import {Label} from "@/components/ui/label";
import UIText from "@/components/theme/UIText";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useScopedI18n} from "@/locales/client";
import { Calendar } from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";

const AddEventSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	date: Yup.string().min(1).max(300, "max 300 characters"),
	venue: Yup.string().min(1).max(300, "max 300 characters"),
	details: Yup.string().min(1).max(300, "max 300 characters"),
});

export const AddEvent = ({ open, onOpenChange, userOwnedGroups }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedGroupName, setSelectedGroupName] = useState('')
	const {user} = useAuth()
	const [addEventDetails, setAddEventDetails] = useState(false)
	const t = useScopedI18n('events')
	const [calendarOpen, setCalendarOpen] = useState(false);

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		try {
			const eventData = {
				name: values.name,
				date: values.date,
				venue: values.venue,
				details: values.details,
				teamId: selectedGroup
			};
			if(selectedGroup){
				await db.events.create(eventData, [
					Permission.read(Role.team(selectedGroup, "member")),
					Permission.update(Role.team(selectedGroup, "member")),
					Permission.delete(Role.team(selectedGroup, "member")),
					Permission.read(Role.user(user.$id)),
					Permission.update(Role.user(user.$id)),
					Permission.delete(Role.user(user.$id)),
				]);
			}else{
				await db.events.create(eventData, );
			}
			onOpenChange(false);
			toast.success(t("alertEventCreated"), ToastOptions);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(t('alertException'), ToastOptions);
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
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 text-primary">
							<UIText variant={'heading'} text={t('addEvent')}/>
						</div>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: "",
								date: new Date(),
								venue: "",
								details: "",
								teamId:"",
							}}
							validationSchema={AddEventSchema}
							onSubmit={(values) => {
								onAdd(values);
							}}
						>
							{({
								  values,
								  errors,
								  touched,
								  handleChange,
								  handleBlur,
								  setFieldValue
							}) => (
								<Form className="flex flex-col w-full space-y-6">

									<div className="flex flex-col gap-2">
										<Label className={"relative text-sm flex items-center justify-between gap-4"}>
											<UIText variant={'label'} className="shrink-0" text={t('labelShareWithGroup')}/>
										</Label>
										<div className={'flex gap-4 items-center relative'}>
											<Select onValueChange={(selected)=> setSelectedGroup(selected)} key={selectedGroup}>
												<SelectTrigger ref={null} className="w-full min-h-14 flex between rtl:flex-row-reverse">
													{selectedGroup ?
														<UIText text={selectedGroupName}/>
														:
														<UIText className={"text-muted-foreground rtl:pr-2"} text={t('selectGroupPlaceholder')}/>
													}
												</SelectTrigger>
												<SelectContent>
													{userOwnedGroups.length===0 &&
														<SelectItem value={null}>
															<UIText className={'text-muted-foreground'} variant={'sm'} text={t('groupNotFound')}/>
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
									</div>

									<div className="flex flex-col">
										<FormLabel
											title={t('labelName')}
											errors={errors.name}
											touched={touched.name}
										/>
										<UITextInput
											onChange={handleChange}
											onBlur={handleBlur}
											name="name"
											disabled={disabled}
										/>
									</div>

									<div
										className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary'}
										onClick={()=> setAddEventDetails(!addEventDetails)}
									>
										<UIText variant={'sm'} className={'font-medium'} text={t('addMoreDetailsText')}/>
										{addEventDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2'}/>}
									</div>

									{addEventDetails &&
										<>
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
																<UIText className={'rtl:font-sans'} variant={'xs'} text={values.date.toLocaleDateString()}/>
																:
																<UIText text={t('pickDate')}/>
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
												<UITextInput
													onChange={handleChange}
													onBlur={handleBlur}
													name="venue"
													disabled={disabled}
												/>
											</div>
											<div className="flex flex-col">
												<FormLabel
													title={t('labelDetails')}
													errors={errors.details}
													touched={touched.details}
												/>
												<UITextArea
													onChange={handleChange}
													onBlur={handleBlur}
													name="details"
													disabled={disabled}
												/>
											</div>
										</>
									}

									<UISheetFooter
										adding={adding}
										disabled={disabled}
										onOpenChange={onOpenChange}
										labelAction={t('btnSaveEntry')}
										labelCancel={t('btnCancel')}
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

export default  AddEvent