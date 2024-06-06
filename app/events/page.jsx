"use client";
import PageContainer from "@/components/providers/PageContainer";
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
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, Info, Pen, Plus, Trash2, X, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "react-responsive";

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

const Page = () => {
	const [data, setData] = useState([]);
	const [value, setValue] = useState("");
	const [openAddModal, setOpenAddModal] = useState(false);
	const [totalSum, setTotalSum] = useState(0);
	const [openEventDetails, setOpenEventDetails] = useState(false);
	const [openEditEventDetails, setOpenEditEventDetails] = useState(false);

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

	const ResetData = (second) => {
		setValue("");
		setData(defaultData);
	};

	useEffect(() => {
		setTotalSum(data?.reduce((acc, item) => acc + item.amount, 0));
	}, []);

	return (
		<PageContainer hideNavbar>
			<div className="flex flex-col bg-primary text-background shadow-lg rounded-b-3xl -mx-6 gap-4 sticky -top-14 z-10">
				<div className="flex justify-between items-center h-14 w-full z-20 border-b border-primary-foreground/40 px-6">
					<Link href={"/"}>
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

					<div
						className="font-semibold"
						onClick={() => setOpenEventDetails(true)}
					>
						<Info className="cursor-pointer hover:scale-125 duration-300 text-background" />
					</div>
				</div>

				<div className="pt-2 pb-6 flex flex-col justify-center items-center gap-4 select-none">
					<Text variant={"h1"} className="text-background">
						Sikandar Ki Mehndi
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
					{data
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((item) => (
							<SingleListItem
								item={item}
								key={item.id}
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

			<AddModal open={openAddModal} onOpen={setOpenAddModal} />
			<EventDetailsModal
				open={openEventDetails}
				onOpenChange={setOpenEventDetails}
			/>
		</PageContainer>
	);
};

export default Page;

const SingleListItem = ({ item, data, setData }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const onEdit = (second) => {};
	const onDelete = (deleteID) => {
		setIsOpen(false);

		const filteredItems = data.filter((item) => item.id !== deleteID);

		setData(filteredItems);
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
								value={Number(item.amount)}
								thousandSeparator={","}
								decimalSeparator={"."}
								displayType="text"
								decimalScale={2}
							/>
						</span>
					</div>
				</div>
			</div>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-[90%] md:max-w-[400px] rounded-xl">
					<DialogHeader className={"pt-4"}>
						<DialogTitle className="text-center">
							<Text variant={"h2"}>{item.name}</Text>
						</DialogTitle>
						<DialogDescription>
							<div className="flex text-foreground gap-2 mt-4 mb-6 justify-center items-center relative select-none pointer-events-none">
								<span className="text-lg font-medium">Rs</span>
								<span className="font-bold text-3xl text-primary">
									<NumericFormat
										allowNegative={false}
										value={Number(item.amount)}
										thousandSeparator={","}
										decimalSeparator={"."}
										displayType="text"
										decimalScale={2}
									/>
								</span>
							</div>
							<DialogFooter
								className={
									"flex flex-row justify-between mt-4 border-t pt-4"
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
							</DialogFooter>
						</DialogDescription>
					</DialogHeader>
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

const AddModal = ({ open, onOpen }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	return (
		<Sheet open={open} onOpenChange={onOpen} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
			>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							New Entry
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
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Name of Person
							</label>
							<Input type="text" autofocus={"false"} />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Amount
							</label>
							{/* <Input type="number" autofocus={"false"} /> */}
							<NumericFormat
								allowNegative={false}
								// value={Number(item.amount)}
								thousandSeparator={","}
								decimalSeparator={"."}
								decimalScale={2}
								className="flex h-12 w-full rounded-md text-[16px] border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Details (if any)
							</label>
							<Textarea />
						</div>
					</div>

					{/* Buttons */}
					<div className="flex items-center justify-between space-x-3">
						<Button
							onClick={() => onOpen(false)}
							size="2xl"
							stretched
						>
							Save Entry
						</Button>
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

	return (
		<Sheet open={open} onOpenChange={onOpen} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
			>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Edit
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
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Name of Person
							</label>
							<Input
								type="text"
								autofocus={"false"}
								value={item.name}
							/>
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Amount
							</label>
							<NumericFormat
								allowNegative={false}
								value={Number(item.amount)}
								thousandSeparator={","}
								decimalSeparator={"."}
								decimalScale={2}
								className="flex h-12 w-full rounded-md text-[16px] border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Details (if any)
							</label>
							<Textarea value={item.description} />
						</div>
					</div>

					{/* Buttons */}
					<div className="flex items-center justify-between space-x-3">
						<Button
							onClick={() => onOpen(false)}
							size="2xl"
							stretched
						>
							Save changes
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DeleteDialog = ({ open, onOpen, onDelete, deleteID }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpen}>
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
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => onDelete(deleteID)}>
						Yes, Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const EventDetailsModal = ({ open, onOpenChange }) => {
	const [openDeleteEvent, setOpenDeleteEvent] = useState(false);
	const [openEditEvent, setOpenEditEvent] = useState(false);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={"w-[90%] rounded-xl"}>
				<DialogHeader>
					<DialogTitle>
						<Text variant={"h2"} className="text-primary">
							Sikandar Ki Mehndi
						</Text>
					</DialogTitle>
				</DialogHeader>

				<Table className="my-6">
					<TableBody className="font-medium">
						<TableRow>
							<TableCell>Total Amount</TableCell>
							<TableCell className="text-right">
								1330000
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell className="text-right">
								28.03.2023
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vanue</TableCell>
							<TableCell className="text-right">
								Bandhan Marriage Hall
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>

				<DialogFooter
					className={
						"flex flex-row justify-between mt-4 border-t pt-4"
					}
				>
					<Button
						type="submit"
						variant="outline"
						size="icon"
						onClick={() => setOpenDeleteEvent(true)}
					>
						<Trash2 className="h-5 w-5 text-primary" />
					</Button>
					<Button
						type="submit"
						variant="outline"
						size="icon"
						onClick={() => setOpenEditEvent(true)}
					>
						<Pen className="h-4 w-4" />
					</Button>
				</DialogFooter>
			</DialogContent>

			<EditEventDetailsModal
				open={openEditEvent}
				onOpenChange={setOpenEditEvent}
			/>
			<DeleteEventDialog
				open={openDeleteEvent}
				onOpenChange={setOpenDeleteEvent}
			/>
		</Dialog>
	);
};

const EditEventDetailsModal = ({ open, onOpenChange }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

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
							Edit Event
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
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Event Name
							</label>
							<Input type="text" autofocus={"false"} />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Event Date
							</label>
							<Input type="text" autofocus={"false"} />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Event Venue
							</label>
							<Input type="text" autofocus={"false"} />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Details (if any)
							</label>
							<Textarea />
						</div>
					</div>

					{/* Buttons */}
					<div className="flex items-center justify-between space-x-3">
						<Button
							onClick={() => onOpenChange(false)}
							size="2xl"
							stretched
						>
							Save Entry
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DeleteEventDialog = ({ open, onOpenChange, onDelete, deleteID }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-[90%]">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Event?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => onDelete(deleteID)}>
						Yes, Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
