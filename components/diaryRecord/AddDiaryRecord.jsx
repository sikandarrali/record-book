"use client";
import { Form, Formik } from "formik";
import {useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import useScrollToView from "@/lib/hooks/useScrollToView";
import UIText from "@/components/theme/UIText";
import {scrollToTop} from "@/lib/utils";
import {ID, Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n} from "@/locales/client";
import {COLLECTION_ID_DIARIES_RECORDS, DATABASE_ID, databases} from "@/components/appwrite/appwrite";
import {UISheet} from "@/components/theme/UISheet";
import * as React from "react";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DiaryRecordSchema} from "@/lib/schemas/DiaryRecordSchema";

export const AddDiaryRecord = ({open, onOpenChange, diaryData}) => {
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const diaryID = diaryData?.$id
	const t = useI18n()

	useScrollToView()

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		const tempCreatedBy = [user?.name, user?.email];

		let teamPermissions = [
			Permission.read(Role.team(diaryData?.teamId, "member")),
			Permission.update(Role.team(diaryData?.teamId, "member")),
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]

		try {
			const diaryItems = {
				name: values.name.trim(),
				diaryId: diaryID,
				markedAsDone: false,
				createdBy: tempCreatedBy,
				updatedBy: []
			};

			if(diaryData?.teamId){
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_DIARIES_RECORDS,
					ID.unique(),
					diaryItems,
					teamPermissions
				);
				response.then(function (response) {
					toast.success(t("alerts.added"), ToastOptions);
					onOpenChange(false);
					scrollToTop()
				}, function (error) {
					toast.error(t('alerts.exception'), ToastOptions);
					console.log(error)
				});

			}else{
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_DIARIES_RECORDS,
					ID.unique(),
					diaryItems
				);
				response.then(function (response) {
					toast.success(t("alerts.added"), ToastOptions);
					onOpenChange(false);
					scrollToTop()
				}, function (error) {
					toast.error(t('alerts.exception'), ToastOptions);
					console.log(error)
				});
			}
		} catch (error) {
			toast.error(t('alerts.exception'), ToastOptions);
			console.log(error)
		}
		setAdding(false);
		setDisabled(false);
	};

	return (
		<UISheet open={open} onOpenChange={onOpenChange}>

			<Formik
				initialValues={{
					name: "",
					markedAsDone: false
				}}
				validationSchema={DiaryRecordSchema}
				onSubmit={(values) => {
					onAdd(values);
				}}
			>
				{({
					  errors,
					  touched,
					  handleChange,
					  handleBlur,
					  setFieldValue,
					  values
				  }) => (
					<Form className="flex flex-col w-full space-y-6">

						{/* Name */}
						<div className={'flex justify-between items-center py-6 mb-4'}>
							<UIText className={"text-primary self-start"} weight={'semibold'} variant={'heading'} text={t('pages.records.add')}/>
						</div>

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

						<UISheetFooterInForm
							adding={adding}
							disabled={disabled}
							onOpenChange={onOpenChange}
							labelAction={t('pages.records.add')}
						/>
					</Form>
				)}
			</Formik>

		</UISheet>
	);
};
