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
import {scrollToTop} from "@/lib/utils";
import {Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useScopedI18n} from "@/locales/client";
import {isStringUrdu} from "@/lib/isStringUrdu";

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

export const AddEventItem = ({open, onOpenChange, eventData}) => {
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const {user} = useAuth()
	const eventID = eventData.$id
	const t = useScopedI18n('events')

	useScrollToView()

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		let cleanAmount = parseFloat(values.amount.replace(/,/g, ""));

		try {
			const eventItemData = {
				name: values.name,
				amount: cleanAmount,
				returned_amount: values.returned_amount,
				details: values.details,
				eventID: eventID
			};

			if(eventData.teamId){
				await db.eventItems.create(eventItemData, [
					Permission.read(Role.team(eventData.teamId, "member")),
					Permission.update(Role.team(eventData.teamId, "member")),
					Permission.delete(Role.team(eventData.teamId, "member")),
					Permission.read(Role.user(user.$id)),
					Permission.update(Role.user(user.$id)),
					Permission.delete(Role.user(user.$id)),
				]);
			}else{
				await db.eventItems.create(eventItemData);
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
					<UIText className={'text-primary self-start py-6'} variant={'heading'}>{t('addEventItem')}</UIText>

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
									<UIText isUrdu={isStringUrdu(values.name)}>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="name"
											disabled={disabled}
										/>
									</UIText>
								</div>
								<div className="flex flex-col">
									<FormLabel
										title={t('labelItemAmount')}
										errors={errors.amount}
										touched={touched.amount}
									/>
									<NumericFormat
										allowNegative={false}
										thousandSeparator={","}
										decimalSeparator={"."}
										decimalScale={2}
										className="flex h-12 w-full rounded-md text-[16px] border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										onChange={handleChange}
										onBlur={handleBlur}
										disabled={disabled}
										name="amount"
										thousandsGroupStyle={'lakh'}
										inputMode="numeric"
									/>
								</div>
								<div className="flex flex-col">
									<FormLabel
										title={t('labelItemDetails')}
										errors={errors.details}
										touched={touched.details}
									/>
									<UIText isUrdu={isStringUrdu(values.details)}>
										<Textarea
											onChange={handleChange}
											onBlur={handleBlur}
											name="details"
											disabled={disabled}
										/>
									</UIText>
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
