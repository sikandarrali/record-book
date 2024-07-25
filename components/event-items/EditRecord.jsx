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
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useI18n, useScopedI18n} from "@/locales/client";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {useAuth} from "@/components/contexts/AuthContext";
import {UINumberInput} from "@/components/theme/UINumberInput";
import {ChevronDown, ChevronUp} from "lucide-react";
import {RecordTypeToggleGroup} from "@/components/event-items/RecordTypeToggleGroup";

const removeExtraSpaces = (value) => value.replace(/\s\s+/g, ' ').trim();

const AddEventItemSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.transform((value) => removeExtraSpaces(value))
		.required("required"),
	amount: Yup.string()
		.min(1)
		.max(100, "max 100 characters")
		.transform((value) => removeExtraSpaces(value))
		.required("required"),
	details: Yup.string()
		.min(1)
		.max(500, "max 500 characters")
		.transform((value) => removeExtraSpaces(value))
});
export const EditRecord = ({ open, onOpenChange, item }) => {
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
			console.log(error)
			setAdding(false);
			setDisabled(false);
		}
		onOpenChange(false);
	};

	return (

		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				className={'p-6 pb-10'}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader className={'hidden'}><SheetTitle/><SheetDescription /></SheetHeader>

				<div className="flex flex-col gap-5 max-w-lg mx-auto items-center lg:py-10">
					<UIText className={'text-primary self-start py-6'} variant={'heading'} text={t('pages.records.editPage')}/>
					<Formik
						initialValues={{
							name: item.name.trim(),
							amount: item.amount,
							details: item.details.trim(),
							type: item.type
						}}
						validationSchema={AddEventItemSchema}
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

								<RecordTypeToggleGroup value={values.type} setFieldValue={setFieldValue} />

								<div className="flex flex-col">
									<FormLabel
										title={t('labels.name')}
										errors={errors.name}
										touched={touched.name}
									/>
									<UITextInput
										onChange={handleChange}
										onBlur={handleBlur}
										name="name"
										disabled={disabled}
										defaultValue={item.name}
									/>
								</div>

								<div className="flex flex-col">
									<FormLabel
										title={t('labels.amount')}
										errors={errors.amount}
										touched={touched.amount}
									/>
									<UINumberInput
										onChange={handleChange}
										onBlur={handleBlur}
										disabled={disabled}
										name="amount"
										defaultValue={item.amount}
									/>
								</div>

								<div
									className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary'}
									onClick={()=> setShowAddDetails(!showAddDetails)}
								>
									<UIText variant={'sm'} className={'font-medium'} text={t('labels.addMoreDetails')}/>
									{showAddDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2'}/>}
								</div>

								{showAddDetails &&
									<div className="flex flex-col">
										<FormLabel
											title={t('labels.details')}
											errors={errors.details}
											touched={touched.details}
										/>
										<UITextArea
											onChange={handleChange}
											onBlur={handleBlur}
											name="details"
											disabled={disabled}
											defaultValue={item.details}
										/>
									</div>
								}

								<UISheetFooter
									adding={adding}
									disabled={disabled}
									onOpenChange={onOpenChange}
								/>
							</Form>
						)}
					</Formik>
				</div>
			</SheetContent>
		</Sheet>
	);
};
