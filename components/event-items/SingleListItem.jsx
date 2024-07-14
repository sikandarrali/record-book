"use client";
import { db } from "@/components/appwrite/database";
import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { Pen, Trash2, XIcon } from "lucide-react";
import {useState} from "react";
import { NumericFormat } from "react-number-format";
import { DeleteEventItem } from "./DeleteEventItem";
import { EditEventItem } from "./EditEventItem";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import {useMediaQuery} from "react-responsive";
import {cn} from "@/lib/utils";

export const SingleListItem = ({ item }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const onDelete = async () => {
		setOpenDelete(false);
		setIsOpen(false);
		await db.eventItems.delete(item.$id);
		toast.success("Deleted!", ToastOptions);
	};

	return (
		<Sheet
			open={isOpen}
			onOpenChange={setIsOpen}
			defaultOpen={false}
		>
			<SheetTrigger asChild>
				<div
					onClick={() => setIsOpen(true)}
					className="flex flex-col w-full px-6 hover:bg-muted select-none py-4 cursor-pointer border-b"
				>
					<div className="flex w-full justify-between gap-5 text-left">
						<span className="font-medium text-[18px]">{item.name}</span>
						<div className="flex gap-2 justify-end items-center relative flex-shrink-0 select-none">
							<span className="text-sm select-none">Rs</span>
							<span className="font-semibold text-xl select-none text-primary">
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

					{item.details &&
						<div className={'overflow-hidden line-clamp-1 mt-1 w-3/4 text-muted-foreground text'}>{item.details}</div>
					}
				</div>
			</SheetTrigger>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>

				<div className="flex flex-col w-full min-h-full pt-4 justify-start">

					<div className="flex flex-col justify-center items-center my-10 lg:mt-32">
						<Text variant={"h2"}>
							{item.name}
						</Text>

						<div className="flex text-foreground gap-2 mt-8 justify-center items-center relative select-none pointer-events-none">
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

						{item.details &&
							<Text className={'mt-20 self-start flex flex-col px-2'}>
								<span className={'font-semibold text-sm mb-1'}>Details</span>
								<span>{item.details}</span>
							</Text>
						}
					</div>

					<div className={'mt-auto py-14 lg:py-0 flex flex-row items-center justify-between px-2'}>
						<div
							className={
								"flex flex-row justify-end gap-4"
							}
						>
							{/*{hasDeletePermission &&*/}
								<Button
									type="submit"
									variant="outline"
									size="icon"
									onClick={() => setOpenDelete(true)}
								>
									<Trash2 className="h-5 w-5 text-primary" />
								</Button>
							{/*}*/}
							<Button
								type="submit"
								variant="outline"
								size="icon"
								onClick={() => {
									setIsOpen(false)
									setOpenEdit(true)
								}}
							>
								<Pen className="h-4 w-4" />
							</Button>
						</div>
						<Button
							type="submit"
							variant="outline"
							size="icon"
							// stretched
							className="w-14 h-14 rounded-full self-center"
							onClick={() => setIsOpen(false)}
						>
							<XIcon className="text-primary" />
						</Button>
					</div>
				</div>

				<EditEventItem
					item={item}
					open={openEdit}
					onOpenChange={setOpenEdit}
					itemSheet={isOpen}
					setItemSheet={setIsOpen}
				/>
				<DeleteEventItem
					personName={item.name}
					open={openDelete}
					onOpenChange={setOpenDelete}
					onDelete={onDelete}
				/>
			</SheetContent>
		</Sheet>
	);
};
