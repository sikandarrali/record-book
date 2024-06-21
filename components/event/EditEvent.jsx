"use client";
import { db } from "@/components/appwrite/database";
import { useAuth } from "@/components/contexts/AuthContext";
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
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";

const EditEventSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	date: Yup.string().min(1).max(300, "max 300 characters"),
	venue: Yup.string().min(1).max(300, "max 300 characters"),
	details: Yup.string().min(1).max(300, "max 300 characters"),
});

export const EditEvent = ({ open, onOpen, eventData }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	const { toast } = useToast();
	const updateEventStore = useMyStore((state) => state.updateEvent);
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const { user } = useAuth();

	const onUpdate = async (values) => {
		setAdding(true);
		setDisabled(true);

		if (
			values.name === eventData.name &&
			values.date === eventData.date &&
			values.venue === eventData.venue &&
			values.details === eventData.details
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
			const eventDataValues = {
				name: values.name,
				date: values.date,
				venue: values.venue,
				details: values.details,
			};

			await db.events.update(eventDataValues, eventData.$id);
			updateEventStore(eventDataValues, eventData.$id);
			onOpen(false);
			toast({
				title: "Event Updated!",
				variant: "success",
			});
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast({
				title: `"Error Updating Event! ${error}`,
				variant: "destructive",
			});
			setAdding(false);
			setDisabled(false);
		}
	};

	return (
		<Sheet open={open} onOpen={onOpen} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Edit Event
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={() => onOpen(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: eventData.name,
								date: eventData.date,
								venue: eventData.venue,
								details: eventData.details,
							}}
							validationSchema={EditEventSchema}
							onSubmit={(values) => {
								onUpdate(values);
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
											title="Event Name"
											errors={errors.name}
											touched={touched.name}
										/>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="name"
											disabled={disabled}
											value={values.name}
										/>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title="Event Date"
											errors={errors.date}
											touched={touched.date}
										/>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="date"
											disabled={disabled}
											value={values.date}
										/>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title="Venue"
											errors={errors.venue}
											touched={touched.venue}
										/>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="venue"
											disabled={disabled}
											value={values.venue}
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
											value={values.details}
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
											"Save Entry"
										)}
									</Button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
