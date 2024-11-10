"use client";
import { db } from "@/components/appwrite/database";
import { Form, Formik } from "formik";
import { useState} from "react";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {useAuth} from "@/components/contexts/AuthContext";
import {Permission, Query, Role} from "appwrite";
import {useData} from "@/components/contexts/DataContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {
	DATABASE_ID,
	databases,
	PARENT_DIARY_ID_FIELD_NAME, COLLECTION_ID_DIARIES
} from "@/components/appwrite/appwrite";
import {PageSchema} from "@/lib/schemas/pageSchema";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DropdownGroupSelectFieldWithLabel} from "@/components/theme/form/DropdownGroupSelectFieldWithLabel";
import * as React from "react";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {UISheet} from "@/components/theme/UISheet";

export const EditDiary = ({ open, onOpenChange, diaryData, setDiaryData, setGroup }) => {
	const t = useI18n()
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const {userOwnedGroups, userGroups} = useData()
	let defaultTeamId = diaryData?.teamId || null;
	const isOwner =  diaryData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`)

	const updateAllItemsInEvent = async (teamId) => {

		const getItems = await db.diariesRecords.list([
			Query.orderDesc("$createdAt"),
			Query.equal(PARENT_DIARY_ID_FIELD_NAME, diaryData?.$id)
		]);
		const tempUpdatedBy = [user?.name, user?.email];

		for (const item of getItems.documents) {
			if(teamId){
				let tempItem = {
					name: item?.name,
					[PARENT_DIARY_ID_FIELD_NAME]: item?.diaryId,
					createdBy: item?.createdBy,
					updatedBy: tempUpdatedBy,
					markedAsDone: item?.markedAsDone
				}

				await db.diariesRecords.update(tempItem, item.$id, [
					Permission.read(Role.team(teamId, "member")),
					Permission.update(Role.team(teamId, "member")),
					Permission.read(Role.user(user.$id)),
					Permission.update(Role.user(user.$id)),
					Permission.delete(Role.user(user.$id)),
				]);
			}else{
				let tempItem = {
					name: item?.name,
					[PARENT_DIARY_ID_FIELD_NAME]: item?.diaryId,
					createdBy: item?.createdBy,
					updatedBy: tempUpdatedBy,
					markedAsDone: item?.markedAsDone
				}
				await db.diariesRecords.update(tempItem, item.$id, [
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
			const diaryDataValues = {
				name: values.name.trim(),
				teamId: values.teamId,
				createdBy: diaryData.createdBy,
				updatedBy: tempUpdatedBy,
			};

			if(isOwner){
				let result = null
				if(values.teamId){
					result = await databases.updateDocument(
						DATABASE_ID,
						COLLECTION_ID_DIARIES,
						diaryData?.$id,
						diaryDataValues,
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
						COLLECTION_ID_DIARIES,
						diaryData?.$id,
						diaryDataValues,
						[
							Permission.read(Role.user(user.$id)),
							Permission.update(Role.user(user.$id)),
							Permission.delete(Role.user(user.$id)),
						]
					);
				}
				setDiaryData(result)
				if(defaultTeamId !== values.teamId){
					await updateAllItemsInEvent(values.teamId);
				}
			}else{
				const result = await databases.updateDocument(
					DATABASE_ID,
					COLLECTION_ID_DIARIES,
					diaryData?.$id,
					diaryDataValues
				);
				setDiaryData(result)
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
			console.log(error)
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
						name: diaryData?.name,
						teamId: diaryData?.teamId,
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
						  setFieldValue,
						  isSubmitting
					  }) => (
						<Form className="flex flex-col w-full space-y-6">

							{/* Name */}
							<InputFieldWithLabel
								label={t('labels.name')}
								errors={errors.name}
								touched={touched.name}
								onChange={handleChange}
								onBlur={handleBlur}
								name="name"
								value={values.name}
								disabled={isSubmitting}
							/>

							{/* Select Group */}
							<DropdownGroupSelectFieldWithLabel
								label={t('labels.group')}
								data={userOwnedGroups}
								fieldValue={diaryData.teamId}
								onSelect={(value)=> {
									setFieldValue('teamId', value)
								}}
								onClear={()=>{
									setFieldValue("teamId", "");
								}}
								isOwner={isOwner}
							/>

							<UISheetFooterInForm
								adding={isSubmitting}
								disabled={isSubmitting}
								onOpenChange={onOpenChange}
							/>
						</Form>
					)}
				</Formik>
			</div>
		</UISheet>
	);
};
