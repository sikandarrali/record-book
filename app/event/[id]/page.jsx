"use client";
import { db } from "@/components/appwrite/database";
import { useAuth } from "@/components/contexts/AuthContext";
import { useData } from "@/components/contexts/DataContext";
import EventInfo from "@/components/event/EventInfo";
import PageContainer from "@/components/providers/PageContainer";
import FormLabel from "@/components/theme/FormLabel";
import Text from "@/components/theme/Text";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { Form, Formik } from "formik";
import {
	ArrowLeft,
	Loader2Icon,
	Pen,
	Plus,
	Trash2,
	X,
	XIcon,
} from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";

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

const defaultData = [
	{
		id: 0,
		name: "احمد",
		amount: 10000,
		description: "salami 500",
	},
	{
		id: "00",
		name: "باقر",
		amount: 10000,
		description: "salami 500",
	},
	{
		id: 1,
		name: "پیر فیصل مسعود چشتی مکارہ",
		amount: 10000,
		description: "salami 500",
	},
	{ id: 2, name: "میاں نوید سابقہ ایم پی اے", amount: 8000, description: "" },
	{ id: 3, name: "Mansoor Lahore", amount: 5000, description: "" },
	{
		id: 4,
		name: "Chaudhary Masood Renala Khurd",
		amount: 2000,
		description: "",
	},
	{ id: 5, name: "GM", amount: 1000, description: "" },
	{ id: 6, name: "Owais", amount: 5000, description: "" },
	{ id: 7, name: "Nomi", amount: 2000, description: "" },
	{ id: 8, name: "Pir Masood Dhaki", amount: 10000, description: "" },
	{ id: 9, name: "Dewan Ahmad Masood USA", amount: 20000, description: "" },
	{
		id: 10,
		name: "Dewan Modood Masood Chishti",
		amount: 50000,
		description: "",
	},
];

const Page = ({ params }) => {
	const [data, setData] = useState([]);
	const [value, setValue] = useState("");
	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [openEventDetails, setOpenEventDetails] = useState(false);
	const [openEditEventDetails, setOpenEditEventDetails] = useState(false);
	const [loading, setLoading] = useState(true);
	const [eventName, setEventName] = useState("");

	const { getEventName } = useData();

	const init = async () => {
		const name = await getEventName(params.id);
		setEventName(name);

		updateItems();

		setLoading(false);
	};

	const updateItems = async () => {
		const getItems = await db.eventItems.list();
		setData(getItems.documents);
	};

	useLayoutEffect(() => {
		init();
	}, []);

	// useEffect(() => {
	// 	updateItems();
	// }, [data]);

	const onSearch = (userValue) => {
		setValue(userValue);

		if (userValue !== "") {
			const temp = defaultData?.filter((item) =>
				item.name.toLowerCase().includes(userValue.toLowerCase())
			);
			setData(temp);
		} else {
			setData(defaultData);
		}
	};

	const ResetData = () => {
		setValue("");
		setData(defaultData);
	};

	// useEffect(() => {
	// 	setTotalSum(data?.reduce((acc, item) => acc + item.amount, 0));
	// }, [data]);

	return (
		<PageContainer hideNavbar>
			{/* {loading ? (
				<div className="inset-0 fixed flex items-center justify-center">
					<Loader />
				</div>
			) : ( */}
			<>
				<div className="flex flex-col bg-primary text-background shadow-lg rounded-b-3xl -mx-6 gap-4 sticky -top-14 z-10">
					<div className="flex justify-between items-center h-14 w-full z-20 border-b border-primary-foreground/40 px-6">
						<Link href={"/"} prefetch>
							<ArrowLeft />
						</Link>

						<div className="flex items-center gap-2 relative select-none pointer-events-none">
							<span className="text-sm">Rs</span>
							<span className="font-bold text-xl">
								<NumericFormat
									allowNegative={false}
									value={Number(totalSum)}
									thousandSeparator={","}
									decimalSeparator={"."}
									displayType="text"
									decimalScale={2}
								/>
							</span>
						</div>

						<EventInfo />
					</div>

					<div className="pt-2 pb-6 flex flex-col justify-center items-center gap-4 select-none">
						<Text variant={"h1"} className="text-background">
							{params.id}
						</Text>
					</div>
				</div>
				<div className="flex flex-col pb-28 mt-4">
					<div className="relative h-14 mb-4">
						<Input
							className="text-[16px] h-full"
							placeholder="Type to search..."
							value={value}
							onChange={(e) => onSearch(e.target.value)}
						/>

						{value !== "" && (
							<XIcon
								className="w-4 h-4 text-primary absolute right-0 top-1/2 -translate-y-1/2 mr-3 cursor-pointer hover:scale-125 duration-300"
								onClick={() => ResetData()}
							/>
						)}
					</div>
					<div className="flex flex-col divide-y -mx-6">
						{data?.map((item) => (
							<SingleListItem
								item={item}
								key={item.$id}
								data={data}
								setData={setData}
							/>
						))}
					</div>
				</div>

				<div
					className="fixed bottom-8 cursor-pointer right-8 z-10 w-[4.5rem] h-[4.5rem] flex items-center justify-center rounded-full bg-primary"
					onClick={() => setOpenAddModal(true)}
				>
					<Plus className="text-white w-10 h-10" />
				</div>

				<AddModal
					open={openAddModal}
					onOpen={setOpenAddModal}
					eventID={params.id}
				/>
			</>
			{/* )} */}
		</PageContainer>
	);
};

export default Page;

const SingleListItem = ({ item }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const [isExpanded, setIsExpanded] = useState(false);
	const { toast } = useToast();

	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const deleteItem = useMyStore((state) => state.deleteEventItem);

	const onEdit = () => {};

	const onDelete = async () => {
		setIsOpen(false);
		setOpenDelete(false);
		deleteItem(item.$id);
		await db.eventItems.delete(item.$id);
		toast({
			title: "Deleted!",
			variant: "success",
		});
	};

	return (
		<>
			<div
				onClick={() => setIsOpen(true)}
				className="flex flex-col w-full px-6 hover:bg-muted select-none py-4 cursor-pointer "
			>
				<div className="flex w-full justify-between gap-5 text-left">
					<span className="font-medium">{item.name}</span>
					<div className="flex gap-2 justify-end items-center relative flex-shrink-0 select-none">
						<span className="text-sm select-none">Rs</span>
						<span className="font-semibold text-xl select-none">
							<NumericFormat
								allowNegative={false}
								value={item.amount}
								thousandSeparator={","}
								decimalSeparator={"."}
								displayType="text"
								decimalScale={2}
							/>
						</span>
					</div>
				</div>
			</div>

			<Dialog open={isOpen} onOpen={setIsOpen}>
				<DialogContent className={"w-[90%] rounded-xl pt-0"} hideClose>
					<div
						className={
							"flex flex-row justify-between mt-4 border-b py-4 pt-1"
						}
					>
						<Button
							type="submit"
							variant="outline"
							size="icon"
							onClick={() => setOpenDelete(true)}
						>
							<Trash2 className="h-5 w-5 text-primary" />
						</Button>
						<Button
							type="submit"
							variant="outline"
							size="icon"
							onClick={() => setOpenEdit(true)}
						>
							<Pen className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-col gap-4 justify-center items-center my-10">
						<Text variant={"h2"} className="text-primary">
							{item.name}
						</Text>

						<div className="flex text-foreground gap-2 justify-center items-center relative select-none pointer-events-none">
							<span className="text-lg font-medium">Rs</span>
							<span className="font-bold text-3xl text-primary">
								<NumericFormat
									allowNegative={false}
									value={item.amount}
									thousandSeparator={","}
									decimalSeparator={"."}
									displayType="text"
									decimalScale={2}
								/>
							</span>
						</div>
					</div>

					<Button
						type="submit"
						variant="outline"
						// stretched
						className="self-center mx-auto rounded-3xl"
						onClick={() => setIsOpen(false)}
					>
						Close
					</Button>
				</DialogContent>
			</Dialog>

			<EditModal
				item={item}
				open={openEdit}
				onOpen={setOpenEdit}
				onEdit={onEdit}
			/>
			<DeleteDialog
				deleteID={item.id}
				open={openDelete}
				onOpen={setOpenDelete}
				onDelete={onDelete}
			/>
		</>
	);
};

const AddModal = ({ open, onOpen, eventID }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	const { toast } = useToast();
	const addEvent = useMyStore((state) => state.addEvent);
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const { user } = useAuth();
	const { name } = useData();

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		try {
			const eventItemData = {
				name: values.name,
				amount: values.amount,
				returned_amount: values.returned_amount,
				details: values.details,
				eventID: eventID,
				userID: user.$id,
			};

			await db.eventItems.create(eventItemData);
			// addEvent(eventItemData);
			onOpen(false);
			toast({
				title: "Data Added!",
				variant: "success",
			});
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast({
				title: `"Error Adding Data!: ${error}`,
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
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Add New Data
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

const EditModal = ({ open, onOpen, item }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	const { toast } = useToast();
	const updateEventItem = useMyStore((state) => state.updateEventItem);
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const { user } = useAuth();
	const { name } = useData();

	const onEdit = async (values) => {
		setAdding(true);
		setDisabled(true);

		try {
			const eventItemData = {
				name: values.name,
				amount: values.amount,
				returned_amount: values.returned_amount,
				details: values.details,
			};

			await db.eventItems.update(eventItemData, item.$id);
			updateEventItem(item.$id, eventItemData);
			onOpen(false);
			toast({
				title: "Data Updated!",
				variant: "success",
			});
			setAdding(false);
			setDisabled(false);
		} catch (error) {
			toast({
				title: `"Error Updating Data!: ${error}`,
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
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Edit Data
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
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DeleteDialog = ({ open, onOpen, deleteID, onDelete }) => {
	return (
		<AlertDialog open={open} onOpen={onOpen}>
			<AlertDialogContent className="max-w-[90%]">
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={() => onDelete(deleteID)}>
						Yes, Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
