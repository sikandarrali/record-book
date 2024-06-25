"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMyStore } from "@/store/store";
import { Form, Formik } from "formik";
import { Loader2Icon, X } from "lucide-react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";

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

	const updateEventItem = useMyStore((state) => state.updateEventItem);
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const onEdit = async (values) => {
		setAdding(true);
		setDisabled(true);

		if (
			values.name === item.name &&
			values.amount === item.amount &&
			values.details === item.details
		) {
			toast({
				title: "No changes detected!",
				variant: "info",
			});

			setAdding(false);
			setDisabled(false);
			return;
		}

		try {
			const eventItemData = {
				name: values.name,
				amount: values.amount,
				returned_amount: values.returned_amount,
				details: values.details,
			};

			await db.eventItems.update(eventItemData, item.$id);
			updateEventItem(item.$id, eventItemData);
			toast({
				title: "items Updated!",
				variant: "success",
			});
			toast.success("Updated!", ToastOptions);
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast.error(`Update failed: ${error}`, ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
		onOpenChange(false);
	};

	return (

		<Drawer open={open} onOpenChange={onOpenChange} onRelease={()=> onOpenChange(false)}>
			<DrawerContent className={'p-6 pb-10'}>
				<DrawerHeader className={'py-8'}>
					<DrawerTitle className={'text-primary'}>Edit Event</DrawerTitle>
					<DrawerDescription className={'hidden'}/>
				</DrawerHeader>
				<div className="flex flex-col gap-5 w-full items-center justify-center lg:py-10">
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
										defaultValue={item.name}
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
										defaultValue={item.amount}
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
										defaultValue={item.details}
									/>
								</div>


								<Button
									className="w-full"
									size="2xl"
									stretched
									disabled={disabled}
								>
									{adding ? (
										<>
											<Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
										</>
									) : (
										"Save Changes"
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
