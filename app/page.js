"use client";
import { db } from "@/components/appwrite/database";
import { useData } from "@/components/contexts/DataContext";
import PageContainer from "@/components/providers/PageContainer";
import FormLabel from "@/components/theme/FormLabel";
import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import { Loader2Icon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";

const defaultData = [
	{ id: 1, name: "Sikandar ki Mehndi" },
	{ id: 2, name: "Sikandar ki Gharoli" },
	{ id: 3, name: "Sikandar ki Barat" },
	{ id: 4, name: "Sikandar ka Walima" },
];

const AddEventSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	date: Yup.string().min(1).max(300, "max 300 characters"),
	// .required("required"),
	venue: Yup.string().min(1).max(300, "max 300 characters"),
	details: Yup.string().min(1).max(300, "max 300 characters"),
});

export default function Home() {
	const [openAddModal, setOpenAddModal] = useState(false);
	// const [loading, setLoading] = useState(true);

	const { events } = useData();

	return (
		<PageContainer hideTopbar>
			<Text variant="h2">Events</Text>

			{/* <AnimatePresence mode="wait"> */}
			{/* {loading && (
					<motion.div
						initial={{ opacity: 1 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.3 },
						}}
						exit={{ opacity: 0 }}
						className="flex flex-col gap-4 -mx-4 px-4 mt-2"
					>
						{[1, 2, 3, 4, 5].map((item) => (
							<div
								key={item}
								className="border shadow rounded-md px-4 py-6 max-w-sm w-full mx-auto"
							>
								<div className="animate-pulse flex space-x-4">
									<div className="flex-1 space-y-4 py-1">
										<div className="h-2 bg-slate-200 rounded"></div>
										<div className="space-y-3">
											<div className="grid grid-cols-3 gap-4">
												<div className="h-2 bg-slate-200 rounded col-span-2"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</motion.div>
				)} */}

			{/* {!loading && ( */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { duration: 0.3, delay: 0.4 },
				}}
				exit={{ opacity: 0 }}
				className="flex flex-col gap-4 -mx-4 px-4 mt-2"
			>
				<div
					onClick={() => setOpenAddModal(!openAddModal)}
					className="border-4 border-dashed border-primary/30 hover:bg-muted cursor-pointer text-base font-medium text-center justify-center flex items-center px-6 py-8 rounded-md"
				>
					Add New Event
				</div>

				{events?.map((event) => (
					<Item key={event?.$id} eventData={event} />
				))}
			</motion.div>
			{/* )} */}
			{/* </AnimatePresence> */}

			<AddModal open={openAddModal} onOpenChange={setOpenAddModal} />
		</PageContainer>
	);
}
const Item = ({ eventData }) => {
	return (
		<Link href={`/event/${eventData.$id}`}>
			<div className="bg-white text-primary hover:bg-muted cursor-pointer font-semibold text-lg shadow text-center justify-center flex items-center px-6 py-8 rounded-md">
				{eventData?.name} - {eventData?.$createdAt}
			</div>
		</Link>
	);
};

const AddModal = ({ open, onOpenChange }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	const { toast } = useToast();
	const addEvent = useMyStore((state) => state.addEvent);
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		try {
			const eventData = {
				name: values.name,
				date: values.date,
				venue: values.venue,
				details: values.details,
			};

			await db.events.create(eventData);
			addEvent(eventData);
			onOpenChange(false);
			toast({
				title: "Event Created!",
				variant: "success",
			});
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast({
				title: `"Error Adding Event!: ${error}`,
				variant: "destructive",
			});
			setAdding(false);
			setDisabled(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
			>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Add New Event
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={() => onOpenChange(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: "",
								date: "",
								venue: "",
								details: "",
							}}
							validationSchema={AddEventSchema}
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
											title="Event Name"
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
											title="Event Date"
											errors={errors.date}
											touched={touched.date}
										/>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="date"
											disabled={disabled}
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
