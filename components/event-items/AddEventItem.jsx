"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, Formik } from "formik";
import {useState} from "react";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Sheet,
	SheetContent, SheetDescription, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import useScrollToView from "@/lib/hooks/useScrollToView";
import {useMediaQuery} from "react-responsive";
import UIText from "@/components/theme/UIText";
import {cn, scrollToTop} from "@/lib/utils";
import {ID, Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useScopedI18n} from "@/locales/client";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {COLLECTION_EVENT_ITEMS, COLLECTION_EVENTS, DATABASE_ID, databases} from "@/components/appwrite/appwrite";
import {UINumberInput} from "@/components/theme/UINumberInput";

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

export const AddEventItem = ({open, onOpenChange, eventData}) => {
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const {user} = useAuth()
	const eventID = eventData?.$id
	const t = useScopedI18n('events')

	useScrollToView()

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		let cleanAmount = parseFloat(values.amount.replace(/,/g, ""));
		const tempCreatedBy = [user?.name, user?.email];

		let teamPermissions = [
			Permission.read(Role.team(eventData?.teamId, "member")),
			Permission.update(Role.team(eventData?.teamId, "member")),
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]

		try {
			const eventItemData = {
				name: values.name.trim(),
				amount: cleanAmount,
				returned_amount: values.returned_amount,
				details: values.details.trim(),
				eventID: eventID,
				createdBy: tempCreatedBy,
				updatedBy: []
			};

			if(eventData?.teamId){
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_EVENT_ITEMS,
					ID.unique(),
					eventItemData,
					teamPermissions
				);
				response.then(function (response) {
					toast.success(t("alertEventItemCreated"), ToastOptions);
				}, function (error) {
					toast.error(t('alertException'), ToastOptions);
				});

			}else{
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_EVENT_ITEMS,
					ID.unique(),
					eventItemData
				);
				response.then(function (response) {
					toast.success(t("alertEventItemCreated"), ToastOptions);
				}, function (error) {
					toast.error(t('alertException'), ToastOptions);
				});
			}
			onOpenChange(false);
			toast.success(t('alertEventItemCreated'), ToastOptions);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(t('alertException'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		}

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
					<UIText className={'text-primary self-start py-6'} weight={'semibold'} variant={'heading'} text={t('addEventItem')}/>

					<Formik
						initialValues={{
							name: "",
							amount: "",
							returned_amount: [],
							details: "",
						}}
						validationSchema={AddEventItemSchema}
						onSubmit={(values) => {
							onAdd(values);
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
