"use client";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn, GetCurrentLanguage, scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import {CalendarIcon, Check, ChevronDown, ChevronsUpDown, ChevronUp, Minus, Plus, XIcon} from "lucide-react";
import {useEffect, useState} from "react";
import { useMediaQuery } from "react-responsive";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {ID, Permission, Role} from "appwrite";
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
import {useI18n} from "@/locales/client";
import { Calendar } from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {COLLECTION_ID_PAGES, DATABASE_ID, databases} from "@/components/appwrite/appwrite";
import {PageSchema} from "@/lib/schemas/pageSchema";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {SupportedLanguages} from "@/lib/defaultData";
import * as React from "react";
import {ClearFieldButton} from "@/components/theme/ClearFieldButton";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {DropdownSelectFieldWithLabel} from "@/components/theme/form/DropdownSelectFieldWithLabel";

export const AddPage = ({ open, onOpenChange, userOwnedGroups }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const [addEventDetails, setAddEventDetails] = useState(false)
	const t = useI18n()


	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		let teamPermissions = [
			Permission.read(Role.team(values.teamId, "member")),
			Permission.update(Role.team(values.teamId, "member")),
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]
		let userPermissions = [
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]

		const tempCreatedBy = [user?.name, user?.email];

		try {
			const eventData = {
				name: values.name.trim(),
				date: values.date,
				details: values.details.trim(),
				teamId: values.teamId,
				createdBy: tempCreatedBy,
				updatedBy: []
			};

			if(values.teamId){
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_PAGES,
					ID.unique(),
					eventData,
					teamPermissions
				);
				response.then(function (response) {
					toast.success(t("alerts.added"), ToastOptions);
				}, function (error) {
					toast.error(t('alerts.exception'), ToastOptions);
					console.log(error)
				});
			}else{
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_PAGES,
					ID.unique(),
					eventData,
					userPermissions
				);
				response.then(function (response) {
					toast.success(t("alerts.added"), ToastOptions);
				}, function (error) {
					toast.error(t('alerts.exception'), ToastOptions);
					console.log(error)
				});
			}
			onOpenChange(false);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(t('alerts.exception'), ToastOptions);
			console.log(error)
			setAdding(false);
			setDisabled(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 bg-background dark:bg-foreground outline-0 overflow-auto h-[90%] lg:h-screen lg:max-h-screen border-t-0 border-l-0")}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 text-primary">
							<UIText variant={'heading'} text={t('pages.home.add')}/>
						</div>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: "",
								date: "",
								details: "",
								teamId:"",
								createdBy: "",
								updatedBy: "",
							}}
							validationSchema={PageSchema}
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


									{/* Select Group */}
									<DropdownSelectFieldWithLabel
										data={userOwnedGroups}
										onSelect={(value)=> {
											setFieldValue('teamId', value)
										}}
										onClear={()=>{
											setFieldValue("teamId", "");
										}}
									/>


									{/* Name */}
									<InputFieldWithLabel
										label={t('labels.name')}
										errors={errors.name}
										touched={touched.name}
										onChange={handleChange}
										onBlur={handleBlur}
										name="name"
										disabled={disabled}
									/>

									<div
										className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary'}
										onClick={()=> setAddEventDetails(!addEventDetails)}
									>
										<UIText variant={'sm'} className={'font-medium'} text={t('labels.addMoreDetails')}/>
										{addEventDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2'}/>}
									</div>

									{addEventDetails &&
										<>
											{/* Date */}
											<DatePickerWithLabel
												label={t('labels.date')}
												setFieldValue={setFieldValue}
												name={'date'}
												disabled={disabled}
												fieldValue={values.date}
												onClear={()=> setFieldValue('date', '')}
											/>

											{/* Details */}
											<TextareaWithLabel
												label={t('labels.details')}
												errors={errors.details}
												touched={touched.details}
												onChange={handleChange}
												onBlur={handleBlur}
												name="details"
												disabled={disabled}
											/>
										</>
									}

									<UISheetFooter
										adding={adding}
										disabled={disabled}
										onOpenChange={onOpenChange}
										labelAction={t('buttons.save')}
										labelCancel={t('buttons.cancel')}
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

export default  AddPage