"use client";
import { db } from "@/components/appwrite/database";
import { Form, Formik } from "formik";
import { useState } from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import UIText from "@/components/theme/UIText";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n} from "@/locales/client";
import {useAuth} from "@/components/contexts/AuthContext";
import * as React from "react";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {UISheet} from "@/components/theme/UISheet";
import {DiaryRecordSchema} from "@/lib/schemas/DiaryRecordSchema";

export const EditDiaryRecord = ({ open, onOpenChange, item, currency }) => {

	const t = useI18n()
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const [showAddDetails, setShowAddDetails ] = useState(false)

	const onEdit = async (values) => {
		setAdding(true);
		setDisabled(true);

		const tempUpdatedBy = [user?.name, user?.email];

		try {
			const diaryItems = {
				name: values.name.trim(),
				markedAsDone: values.markedAsDone,
				createdBy: item.createdBy,
				updatedBy: tempUpdatedBy
			};

			await db.diariesRecords.update(diaryItems, item.$id);
			toast.success(t('alerts.updated'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast.error(t('alerts.exception'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
		onOpenChange(false);
	};

	return (

		<UISheet open={open} onOpenChange={onOpenChange}>
			<div className="flex flex-col w-full gap-5 max-w-lg mx-auto items-center lg:py-10">
				<Formik
					initialValues={{
						name: item.name.trim(),
						markedAsDone: item.markedAsDone
					}}
					validationSchema={DiaryRecordSchema}
					onSubmit={(values) => {
						onEdit(values);
					}}
				>
					{({
						  errors,
						  touched,
						  handleChange,
						  handleBlur,
						  setFieldValue,
						  values,
						isSubmitting
					  }) => (
						<Form className="flex flex-col w-full space-y-6">

							{/* Name */}
							<div className={'flex justify-between items-center py-6 mb-4'}>
								<UIText className={"text-primary self-start"} weight={'semibold'} variant={'heading'} text={t('pages.records.editPage')}/>
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
								disabled={isSubmitting}
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
