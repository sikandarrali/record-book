"use client";
import PageContainer from "@/components/providers/PageContainer";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Edit, Plus, Settings, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
// import { CurrencyFormatter } from "@/utilis/CurrencyFormatter";
// import { FormattedDate } from "@/utilis/FormatDate";
// import { format } from "date-fns";
// import EditTransaction from "./EditTransactions";

const defaultData = [
	{ id: 1, name: "Pir Faisal Masood Faridabad", amount: 10000 },
	{ id: 2, name: "میاں نوید سابقہ ایم پی اے", amount: 8000 },
	{ id: 3, name: "Mansoor Lahore", amount: 5000 },
	{ id: 4, name: "Chaudhary Qayyum Renala Khurd", amount: 2000 },
	{ id: 5, name: "GM", amount: 1000 },
	{ id: 6, name: "Owais", amount: 5000 },
	{ id: 7, name: "Nomi", amount: 2000 },
	{ id: 8, name: "Pir Masood Dhaki", amount: 10000 },
	{ id: 9, name: "Dewan Ahmad Masood USA", amount: 20000 },
	{ id: 10, name: "Dewan Modood Masood Chishti", amount: 50000 },
];

const Page = () => {
	const [data, setData] = useState(defaultData);
	const [value, setValue] = useState("");
	const [openAddModal, setOpenAddModal] = useState(false);

	const totalSum = data?.reduce((acc, item) => acc + item.amount, 0);

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

	return (
		<PageContainer>
			<div className="sticky top-11 z-10 bg-white -mx-4 px-4 pt-10 pb-2 shadow-sm flex flex-col gap-4 select-none">
				<h2 className="text-2xl font-semibold text-primary select-none pointer-events-none">
					Sikandar Ki Mehndi
				</h2>
				<div className="flex gap-2 justify-end items-center relative select-none pointer-events-none">
					<span>Rs</span>
					<span className="font-bold text-xl">{totalSum}</span>
				</div>
			</div>

			<div className="fixed top-4 z-20 left-1/2 -translate-x-1/2 font-medium text-sm bg-white select-none">
				10 March 2023
			</div>

			<div className="fixed top-4 z-20 right-4 font-semibold">
				<Settings />
			</div>

			<div className="flex flex-col pb-28 mt-4">
				<Input
					className="text-[16px] h-14 mb-4"
					placeholder="Type to search..."
					value={value}
					onChange={(e) => onSearch(e.target.value)}
				/>

				<div className="flex flex-col gap-2">
					{data.map((item) => (
						<SingleItem data={item} key={item} />
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
		</PageContainer>
	);
};

export default Page;

const SingleItem = ({ data }) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div className="bg-muted/50 hover:bg-muted select-none p-4 rounded-md shadow cursor-pointer flex justify-between gap-4">
					<span className="font-medium">{data.name}</span>
					<div className="flex gap-2 justify-end items-center relative flex-shrink-0 select-none">
						<span className="text-sm select-none">Rs</span>
						<span className="font-semibold text-xl select-none">
							{data.amount}
						</span>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem className="flex items-center gap-2">
					<Edit className="w-4 h-4" />
					<span className="font-medium">Edit</span>
				</ContextMenuItem>
				<Separator />
				<ContextMenuItem className="flex items-center gap-2">
					<Trash2 className="w-4 h-4" />
					<span className="font-medium">Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
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
						<div className="flex items-center space-x-2 font-semibold text-primary">
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
							<Input type="number" autofocus={"false"} />
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
