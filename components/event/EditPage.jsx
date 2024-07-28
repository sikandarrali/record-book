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
import {Permission, Query, Role} from "appwrite";
import {useData} from "@/components/contexts/DataContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
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
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DropdownSelectFieldWithLabel} from "@/components/theme/form/DropdownSelectFieldWithLabel";
import * as React from "react";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {UISheet} from "@/components/theme/UISheet";
import {BookTypeToggleGroup} from "@/components/event/BookTypeToggleGroup";

export const EditPage = ({ open, onOpenChange, pageData, setPageData, setGroup }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const t = useI18n()
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const {userOwnedGroups, userGroups} = useData()
	const [addEventDetails, setAddEventDetails] = useState(false)

	let defaultTeamId = pageData?.teamId || null;

	const isOwner =  pageData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`)

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
				type: values.type,
				details: values.details.trim(),
				teamId: values.teamId,
				createdBy: pageData.createdBy,
				updatedBy: tempUpdatedBy
			};

			if(isOwner){
				let result = null
				if(values.teamId){
					result = await databases.updateDocument(
						DATABASE_ID,
						COLLECTION_ID_PAGES,
						pageData?.$id,
						pageDataValues,
						[
							Permission.read(Role.team(values.teamId, "member")),
							Permission.update(Role.team(values.teamId, "member")),
							Permission.read(Role.user(user.$id)),
							Permission.update(Role.user(user.$id)),
							Permission.delete(Role.user(user.$id)),
						]
					);
				}else{
					result = await databases.updateDocument(
						DATABASE_ID,
						COLLECTION_ID_PAGES,
						pageData?.$id,
						pageDataValues,
						[
							Permission.read(Role.user(user.$id)),
							Permission.update(Role.user(user.$id)),
							Permission.delete(Role.user(user.$id)),
						]
					);
				}
				setPageData(result)
				if(defaultTeamId !== values.teamId){
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

			setGroup(userOwnedGroups.find((item)=> item.$id === values.teamId))
			toast.success(t('alerts.updated'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			onOpenChange(false)
		} catch (error) {
			toast.error(t('alerts.exception'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
	};

	return (
		<UISheet
			open={open}
			onOpenChange={onOpenChange}
		>
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
						teamId: pageData?.teamId,
						type: pageData?.type
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

							{/* Book Type */}
							<div className={'flex flex-col'}>
								<FormLabel title={t('labels.bookType')}/>
								<BookTypeToggleGroup value={values.type} setFieldValue={setFieldValue} />
							</div>

							{/* Select Group */}
							<DropdownSelectFieldWithLabel
								label={t('labels.group')}
								data={userOwnedGroups}
								fieldValue={pageData.teamId}
								onSelect={(value)=> {
									setFieldValue('teamId', value)
								}}
								onClear={()=>{
									setFieldValue("teamId", "");
								}}
								isOwner={isOwner}
							/>

							{/* Name */}
							<InputFieldWithLabel
								label={t('labels.name')}
								errors={errors.name}
								touched={touched.name}
								onChange={handleChange}
								onBlur={handleBlur}
								name="name"
								value={values.name}
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
										value={values.details}
									/>

								</>
							}

							<UISheetFooterInForm
								adding={adding}
								disabled={disabled}
								onOpenChange={onOpenChange}
							/>
						</Form>
					)}
				</Formik>
			</div>
		</UISheet>
	);
};
