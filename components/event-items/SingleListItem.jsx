"use client";
import { db } from "@/components/appwrite/database";
import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import { useMyStore } from "@/store/store";
import { Pen, Trash2, XIcon } from "lucide-react";
import {useEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import { DeleteEventItem } from "./DeleteEventItem";
import { EditEventItem } from "./EditEventItem";
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

export const SingleListItem = ({ item }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const deleteItem = useMyStore((state) => state.deleteEventItem);

	const onEdit = () => {};

	const onDelete = async () => {
		setOpenDelete(false);
		setIsOpen(false);
		deleteItem(item.$id);
		await db.eventItems.delete(item.$id);
		toast.success("Deleted!", ToastOptions);
	};

	// fixes dialog adding pointer-events:none to body
	// document.body.style.pointerEvents = "auto";
	useEffect(() => {
		if (isOpen) {
			// Pushing the change to the end of the call stack
			const timer = setTimeout(() => {
				document.body.style.pointerEvents = "";
			}, 0);
			return () => clearTimeout(timer);
		} else {
			document.body.style.pointerEvents = "auto";
		}
	}, [isOpen]);

	return (
		<>
			<div
				onClick={() => setIsOpen(true)}
				className="flex flex-col w-full px-6 hover:bg-muted select-none py-4 cursor-pointer "
			>
				<div className="flex w-full justify-between gap-5 text-left">
					<span className="font-medium text-[18px]">{item.name}</span>
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


			<Drawer
				onRelease={()=> setIsOpen(false)}
				open={isOpen}
				onOpen={setIsOpen}
			>
				<DrawerContent className={'p-6'}>
					<DrawerHeader className={'mb-0 px-0 pb-0.5'}>
						<div className={'hidden'}><DrawerTitle/><DrawerDescription/></div>

						<div
							className={
								"flex flex-row justify-between pt-1 pb-4 border-b"
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
					</DrawerHeader>

					<div className="flex flex-col gap-4 !mt-12 justify-center items-center my-10">
						<Text variant={"h2"}>
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

						{item.details &&
							<Text className={'mt-6'}>
								{item.details}
							</Text>
						}
					</div>

					<DrawerFooter>
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
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<EditEventItem
				item={item}
				open={openEdit}
				onOpenChange={setOpenEdit}
				onEdit={onEdit}
			/>
			<DeleteEventItem
				personName={item.name}
				open={openDelete}
				onOpenChange={setOpenDelete}
				onDelete={onDelete}
			/>
		</>
	);
};
