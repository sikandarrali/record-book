"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Form, Formik } from "formik";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {SheetDescription, SheetHeader, SheetTitle, SheetContent, Sheet} from "@/components/ui/sheet";
import UIText from "@/components/theme/UIText";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n, useScopedI18n} from "@/locales/client";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {useAuth} from "@/components/contexts/AuthContext";
import {UINumberInput} from "@/components/theme/UINumberInput";
import {ChevronDown, ChevronUp} from "lucide-react";
import {RecordTypeToggleGroup} from "@/components/record/RecordTypeToggleGroup";
import {RecordSchema} from "@/lib/schemas/RecordSchema";
import * as React from "react";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {NumberInputFieldWithLabel} from "@/components/theme/form/NumberInputFieldWithLabel";
import {UISheet} from "@/components/theme/UISheet";
import {getCurrentCurrency} from "@/lib/utils";

export const EditRecord = ({ open, onOpenChange, item, currency }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const t = useI18n()

	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const [showAddDetails, setShowAddDetails ] = useState(false)


	const onEdit = async (values) => {
		setAdding(true);
		setDisabled(true);

		let cleanAmount = parseFloat(values.amount.toString().replace(/,/g, ""));
		const tempUpdatedBy = [user?.name, user?.email];

		if (
			values.name === item.name &&
			values.amount === item.amount &&
			values.date === item.date &&
			values.details === item.details &&
			values.type === item.type
		) {
			toast.info(t('alerts.noChanges'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			return;
		}

		try {
			const eventItemData = {
				name: values.name.trim(),
				amount: cleanAmount,
				date: values.date,
				type: values.type,
				details: values.details.trim(),
				createdBy: item.createdBy,
				updatedBy: tempUpdatedBy
			};

			await db.records.update(eventItemData, item.$id);
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
						amount: item.amount,
						date: item.date,
						details: item.details.trim(),
						type: item.type
					}}
					validationSchema={RecordSchema}
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
						  values
					  }) => (
						<Form className="flex flex-col w-full space-y-6">

							{/* Record Type */}
							<div className={'flex justify-between items-center py-6 mb-4'}>
								<UIText className={"text-primary self-start"} weight={'semibold'} variant={'heading'} text={t('pages.records.editPage')}/>
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
								value={values.name}
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
								defaultValue={item.amount}
								currency={getCurrentCurrency(currency)}
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
								className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary'}
								onClick={()=> setShowAddDetails(!showAddDetails)}
							>
								<UIText variant={'sm'} className={'font-medium'} text={t('labels.addMoreDetailsShort')}/>
								{showAddDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2'}/>}
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
