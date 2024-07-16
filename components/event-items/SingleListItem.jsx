"use client";
import { db } from "@/components/appwrite/database";
import UIText from "@/components/theme/UIText";
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
import {useScopedI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {isStringUrdu} from "@/lib/isStringUrdu";

export const SingleListItem = ({ item }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const t = useScopedI18n('events')

	const onDelete = async () => {
		setOpenDelete(false);
		setIsOpen(false);
		await db.eventItems.delete(item.$id);
		toast.success(t('alertEventItemDeleted'), ToastOptions);
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
						<UIText isUrdu={isStringUrdu(item.name)} className={'rtl:text-right'}>{item.name}</UIText>
						<div className="flex gap-2 justify-end rtl:flex-row-reverse items-center relative flex-shrink-0 select-none">
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
						<UIText
							isUrdu={isStringUrdu(item.details)}
							className={'overflow-hidden line-clamp-1 mt-1 w-3/4 text-muted-foreground text'}
						>
							{item.details}
						</UIText>
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
						<UIText variant={"heading"} className={'text-center'} isUrdu={isStringUrdu(item.name)}>
							{item.name}
						</UIText>

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
							<UIText className={'mt-20 self-start flex flex-col px-2'} isUrdu={isStringUrdu(item.details)}>
								<UIText className={'font-semibold text-sm mb-1'}>{t('labelItemDetails')}</UIText>
								<UIText>{item.details}</UIText>
							</UIText>
						}
					</div>

					<UISheetInfoFooter
						setOpen={setIsOpen}
						setOpenDelete={setOpenDelete}
						setOpenEdit={setOpenEdit}
					/>
				</div>

				<EditEventItem
					item={item}
					open={openEdit}
					onOpenChange={setOpenEdit}
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
