"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Form, Formik } from "formik";
import {ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {useAuth} from "@/components/contexts/AuthContext";
import {Permission, Query, Role} from "appwrite";
import {useData} from "@/components/contexts/DataContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {
	COLLECTION_ID_BOOKS,
	DATABASE_ID,
	databases,
	PARENT_BOOK_ID_FIELD_NAME
} from "@/components/appwrite/appwrite";
import {PageSchema} from "@/lib/schemas/pageSchema";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DropdownGroupSelectFieldWithLabel} from "@/components/theme/form/DropdownGroupSelectFieldWithLabel";
import * as React from "react";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {UISheet} from "@/components/theme/UISheet";
import {BookTypeToggleGroup} from "@/components/page/BookTypeToggleGroup";
import {DropdownCurrencySelectFieldWithLabel} from "@/components/theme/form/DropdownCurrencySelectFieldWithLabel";
import {SupportedCurrencies} from "@/lib/defaultData";

export const EditPage = ({ open, onOpenChange, pageData, setPageData, setGroup }) => {
	const t = useI18n()
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const {userOwnedGroups, userGroups} = useData()
	const [addEventDetails, setAddEventDetails] = useState(false)
	let defaultTeamId = pageData?.teamId || null;

	const isOwner =  pageData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`)

	const updateAllItemsInEvent = async (teamId) => {

		const getItems = await db.records.list([
			Query.orderDesc("$createdAt"),
			Query.equal(PARENT_BOOK_ID_FIELD_NAME, pageData?.$id)
		]);

		for (const item of getItems.documents) {
			if(teamId){
				let tempItem = {
					name: item?.name,
					details: item?.details,
					type: item?.type,
					[PARENT_BOOK_ID_FIELD_NAME]: item?.pageId,
					amount: item?.amount,
					date: item?.date,
					createdBy: item?.createdBy,
					updatedBy: item?.updatedBy,
				}

				await db.records.update(tempItem, item.$id, [
					Permission.read(Role.team(teamId, "member")),
					Permission.update(Role.team(teamId, "member")),
					Permission.read(Role.user(user.$id)),
					Permission.update(Role.user(user.$id)),
					Permission.delete(Role.user(user.$id)),
				]);
			}else{
				const tempUpdatedBy = [user?.name, user?.email];
				let tempItem = {
					name: item?.name,
					details: item?.details,
					type: item?.type,
					[PARENT_BOOK_ID_FIELD_NAME]: item?.pageId,
					amount: item?.amount,
					date: item?.date,
					createdBy: item?.createdBy,
					updatedBy: item?.updatedBy,
				}
				await db.records.update(tempItem, item.$id, [
					Permission.read(Role.user(user.$id)),
					Permission.update(Role.user(user.$id)),
					Permission.delete(Role.user(user.$id)),
				]);
			}
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
				updatedBy: tempUpdatedBy,
				currency: values.currency
			};

			if(isOwner){
				let result = null
				if(values.teamId){
					result = await databases.updateDocument(
						DATABASE_ID,
						COLLECTION_ID_BOOKS,
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
						COLLECTION_ID_BOOKS,
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
					await updateAllItemsInEvent(values.teamId);
				}
			}else{
				const result = await databases.updateDocument(
					DATABASE_ID,
					COLLECTION_ID_BOOKS,
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
				text={t('pages.books.editPage')}
			/>

			<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
				<Formik
					initialValues={{
						name: pageData?.name,
						date: pageData?.date,
						details: pageData?.details,
						teamId: pageData?.teamId,
						type: pageData?.type,
						currency: pageData?.currency
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
							<DropdownGroupSelectFieldWithLabel
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

									{/* Currency */}
									<DropdownCurrencySelectFieldWithLabel
										label={t('labels.currency')}
										data={SupportedCurrencies}
										onSelect={(value)=> {
											setFieldValue('currency', value)
										}}
										onClear={()=>{
											setFieldValue("currency", "");
										}}
										fieldValue={values.currency}
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
