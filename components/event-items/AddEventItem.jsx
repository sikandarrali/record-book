"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, Formik } from "formik";
import { Loader2Icon, X } from "lucide-react";
import {useEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer";
import {
	Sheet,
	SheetContent, SheetDescription, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import useScrollToView from "@/lib/hooks/useScrollToView";
import {useMediaQuery} from "react-responsive";
import Text from "@/components/theme/Text";
import {scrollToTop} from "@/lib/utils";
import {Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {useParams} from "next/navigation";
import {useMyStore} from "@/store/store";

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
	const eventsStore = useMyStore((state) => state.events);

	const eventID = eventData.$id

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
				]);
			}else{
				await db.eventItems.create(eventItemData);
			}
			onOpenChange(false);
			toast.success("New Item Added", ToastOptions);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(`Unable to Add: ${error}`, ToastOptions);
			setAdding(false);
			setDisabled(false);
		}

	};

	// console.log(eventData.teamId)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				className={'p-6 pb-10'}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader className={'hidden'}><SheetTitle/><SheetDescription /></SheetHeader>

				<div className="flex flex-col gap-5 max-w-lg mx-auto items-center lg:py-10">
					<Text className={'text-primary self-start py-6'} variant={'h2'}>Add New Record</Text>

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
										thousandsGroupStyle={'lakh'}
										inputMode="numeric"
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
					<Button
						className="w-full"
						size="2xl"
						stretched
						disabled={disabled}
						variant={'outline'}
						onClick={()=> onOpenChange(false)}
					>
						Cancel
					</Button>
				</div>

			</SheetContent>
		</Sheet>
	);
};
