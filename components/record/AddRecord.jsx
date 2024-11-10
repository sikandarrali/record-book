"use client";
import { Form, Formik } from "formik";
import {useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import useScrollToView from "@/lib/hooks/useScrollToView";
import UIText from "@/components/theme/UIText";
import {getCurrentCurrency, scrollToTop} from "@/lib/utils";
import {ID, Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n} from "@/locales/client";
import {COLLECTION_ID_BOOKS_RECORDS, DATABASE_ID, databases} from "@/components/appwrite/appwrite";
import {RecordSchema} from "@/lib/schemas/RecordSchema";
import {ChevronDown, ChevronUp} from "lucide-react";
import {RecordTypeToggleGroup} from "@/components/record/RecordTypeToggleGroup";
import {UISheet} from "@/components/theme/UISheet";
import * as React from "react";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {NumberInputFieldWithLabel} from "@/components/theme/form/NumberInputFieldWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";

export const AddRecord = ({open, onOpenChange, pageData}) => {
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const pageID = pageData?.$id
	const t = useI18n()
	const [showAddDetails, setShowAddDetails ] = useState(false)

	useScrollToView()

	const onAdd = async (values) => {
		// setAdding(true);
		// setDisabled(true);

		let cleanAmount = parseFloat(values.amount.replace(/,/g, ""));
		const tempCreatedBy = [user?.name, user?.email];

		let teamPermissions = [
			Permission.read(Role.team(pageData?.teamId, "member")),
			Permission.update(Role.team(pageData?.teamId, "member")),
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]

		try {
			const eventItemData = {
				name: values.name.trim(),
				amount: cleanAmount,
				type: values.type,
				date: values.date,
				details: values.details.trim(),
				pageId: pageID,
				createdBy: tempCreatedBy,
				updatedBy: []
			};

			if(pageData?.teamId){
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_BOOKS_RECORDS,
					ID.unique(),
					eventItemData,
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
					COLLECTION_ID_BOOKS_RECORDS,
					ID.unique(),
					eventItemData
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
					amount: "",
					date: pageData?.type === "khaataBook" ? new Date() : '',
					type: pageData?.type === "recordBook" ? "income" : "expense",
					details: "",
				}}
				validationSchema={RecordSchema}
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
					  isSubmitting,
					  values
				  }) => (
					<Form className="flex flex-col w-full space-y-6">

						{/* Record Type */}
						<div className={'flex justify-between items-center py-6 mb-4'}>
							<UIText className={"text-primary self-start"} weight={'semibold'} variant={'heading'} text={t('pages.records.add')}/>
							<RecordTypeToggleGroup value={values.type} setFieldValue={setFieldValue} />
						</div>

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

						{/* Amount */}
						<NumberInputFieldWithLabel
							label={t('labels.amount')}
							errors={errors.amount}
							touched={touched.amount}
							onChange={handleChange}
							onBlur={handleBlur}
							name="amount"
							disabled={disabled}
							currency={getCurrentCurrency(pageData?.currency)}
						/>

						{/* Date */}
						<DatePickerWithLabel
							label={t('labels.date')}
							setFieldValue={setFieldValue}
							name={'date'}
							disabled={disabled}
							fieldValue={values.date}
							onClear={()=> setFieldValue('date', '')}
						/>

						<div
							className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary dark:text-foreground'}
							onClick={()=> setShowAddDetails(!showAddDetails)}
						>
							<UIText variant={'sm'} className={'font-medium'} text={t('labels.addMoreDetailsShort')}/>
							{showAddDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2 text-primary'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2 text-primary'}/>}
						</div>

						{showAddDetails &&
							<>
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

						<UISheetFooterInForm
							adding={isSubmitting}
							disabled={isSubmitting}
							onOpenChange={onOpenChange}
							labelAction={t('pages.records.add')}
						/>
					</Form>
				)}
			</Formik>

		</UISheet>
	);
};
