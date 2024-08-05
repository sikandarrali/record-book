"use client";
import {scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import {useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {ID, Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";
import {COLLECTION_ID_DIARIES, DATABASE_ID, databases} from "@/components/appwrite/appwrite";
import * as React from "react";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DropdownGroupSelectFieldWithLabel} from "@/components/theme/form/DropdownGroupSelectFieldWithLabel";
import {UISheet} from "@/components/theme/UISheet";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useData} from "@/components/contexts/DataContext";
import {DiarySchema} from "@/lib/schemas/diarySchema";

export const AddDiary = ({ open, onOpenChange }) => {

	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const [addEventDetails, setAddEventDetails] = useState(false)
	const t = useI18n()
	const {userOwnedGroups} = useData()

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
			const diaryData = {
				name: values.name.trim(),
				teamId: values.teamId,
				createdBy: tempCreatedBy,
				updatedBy: [],
			};

			if(values.teamId){
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_DIARIES,
					ID.unique(),
					diaryData,
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
					COLLECTION_ID_DIARIES,
					ID.unique(),
					diaryData,
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
		} finally {
			setAdding(false)
			setDisabled(false)
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
				text={t('pages.diaries.add')}
			/>

			<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
				<Formik
					initialValues={{
						name: "",
						details: "",
						teamId: "",
						createdBy: "",
						updatedBy: "",
					}}
					validationSchema={DiarySchema}
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
						<Form className="flex flex-col w-full space-y-8">

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


							{/* Select Group */}
							<DropdownGroupSelectFieldWithLabel
								label={t('labels.shareWithGroup')}
								data={userOwnedGroups}
								onSelect={(value)=> {
									setFieldValue('teamId', value)
								}}
								onClear={()=>{
									setFieldValue("teamId", "");
								}}
								isOwner={true}
								fieldValue={values.teamId}
							/>


							<div className={'mt-auto'}/>
							<UISheetFooterInForm
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
		</UISheet>
	);
};

export default  AddDiary