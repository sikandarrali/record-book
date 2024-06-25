"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { Form, Formik } from "formik";
import { Loader2Icon, X } from "lucide-react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer";

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

export const AddEventItem = ({ open, onOpenChange, eventID, refreshItems, setRefreshItems }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	const addEventStore = useMyStore((state) => state.addEventItem);
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);

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
				eventID: eventID,
			};

			// addEventStore(eventItemData);
			// setRefreshItems(!refreshItems);
			await db.eventItems.create(eventItemData);
			onOpenChange(false);
			toast.success("New Item Added", ToastOptions);
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast.error(`Unable to Add: ${error}`, ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className={'p-6 pb-10'}>
				<DrawerHeader className={'py-8'}>
					<DrawerTitle className={'text-primary'}>Add New Record</DrawerTitle>
					<DrawerDescription className={'hidden'}/>
				</DrawerHeader>


				<div className="flex flex-col gap-5 w-full items-center justify-center lg:py-10">
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
							  values,
							  handleChange,
							  handleBlur,
							  handleSubmit,
							  setFieldValue,
						  }) => (
							<Form className="flex flex-col w-full space-y-6">
								<div className="flex flex-col">
									<FormLabel
										title="Name of Person"
										errors={errors.name}
										touched={touched.name}
									/>
									<Input
										onChange={handleChange}
										onBlur={handleBlur}
										name="name"
										disabled={disabled}
									/>
								</div>
								<div className="flex flex-col">
									<FormLabel
										title="Amount"
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
									/>
								</div>
								<div className="flex flex-col">
									<FormLabel
										title="Detailes (if any)"
										errors={errors.details}
										touched={touched.details}
									/>
									<Textarea
										onChange={handleChange}
										onBlur={handleBlur}
										name="details"
										disabled={disabled}
									/>
								</div>

								<Button
									className="w-full"
									size="2xl"
									stretched
									disabled={disabled}
									type="submit"
								>
									{adding ? (
										<>
											<Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
										</>
									) : (
										"Save Entry"
									)}
								</Button>
							</Form>
						)}
					</Formik>
				</div>
				<Button
					className="w-full mt-3"
					size="2xl"
					stretched
					disabled={disabled}
					variant={'outline'}
					onClick={()=> onOpenChange(false)}
				>
					Cancel
				</Button>
			</DrawerContent>
		</Drawer>
	);
};
