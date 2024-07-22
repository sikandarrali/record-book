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
import {useScopedI18n} from "@/locales/client";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {useAuth} from "@/components/contexts/AuthContext";
import {UINumberInput} from "@/components/theme/UINumberInput";

const AddEventItemSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	amount: Yup.string()
		.min(1)
		.max(100, "max 100 characters")
		.required("required"),
	details: Yup.string().min(1).max(500, "max 500 characters"),
});
export const EditEventItem = ({ open, onOpenChange, item }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const t = useScopedI18n('events')

	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()

	const onEdit = async (values) => {
		setAdding(true);
		setDisabled(true);

		let cleanAmount = parseFloat(values.amount.toString().replace(/,/g, ""));
		const tempUpdatedBy = [user?.name, user?.email];

		if (
			values.name === item.name &&
			values.amount === item.amount &&
			values.details === item.details
		) {
			toast.info(t('alertNothingToUpdate'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			return;
		}

		try {
			const eventItemData = {
				name: values.name,
				amount: cleanAmount,
				returned_amount: values.returned_amount,
				details: values.details,
				createdBy: item.createdBy,
				updatedBy: tempUpdatedBy
			};

			await db.eventItems.update(eventItemData, item.$id);
			toast.success(t('alertEventItemUpdated'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast.error(t('alertException'), ToastOptions);
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
					<UIText className={'text-primary self-start py-6'} variant={'heading'} text={t('editEventItem')}/>
					<Formik
						initialValues={{
							name: item.name,
							amount: item.amount,
							returned_amount: [],
							details: item.details,
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
							  values
						  }) => (
							<Form className="flex flex-col w-full space-y-6">
								<div className="flex flex-col">
									<FormLabel
										title={t('labelItemName')}
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
										title={t('labelItemAmount')}
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
								<div className="flex flex-col">
									<FormLabel
										title={t('labelItemDetails')}
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
