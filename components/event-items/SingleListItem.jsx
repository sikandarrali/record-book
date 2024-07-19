"use client";
import { db } from "@/components/appwrite/database";
import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {ChevronsRight, CornerDownLeft, CornerDownRight, Pen, Trash2, XIcon} from "lucide-react";
import {useEffect, useState} from "react";
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
import {useRouter, useSearchParams} from "next/navigation";

export const SingleListItem = ({ item }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const t = useScopedI18n('events')
	const searchParams = useSearchParams()
	const router = useRouter()

	const onDelete = async () => {
		setOpenDelete(false);
		setIsOpen(false);
		await db.eventItems.delete(item.$id);
		toast.success(t('alertEventItemDeleted'), ToastOptions);
	};

	// useEffect(() => {
	// 	if(isOpen){
	// 		const newParams = new URLSearchParams(searchParams);
	// 		newParams.set('record', item.$id);
	// 		router.push(`?${newParams.toString()}`, { shallow: true });
	// 	}else{
	// 		onClose()
	// 	}
	// }, [isOpen]);
	//
	// const onClose = () =>{
	// 	let event = searchParams.get('event')
	// 	if(event){
	// 		setIsOpen(false)
	// 		const newParams = new URLSearchParams(searchParams);
	// 		newParams.delete('record');
	// 		router.push(`?${newParams.toString()}`, { shallow: true });
	// 	}
	// }
	//
	// useEffect(() => {
	// 	let isEventInURL = searchParams.get('event')
	// 	let isRecordInURL = searchParams.get('record')
	// 	if (isEventInURL && isRecordInURL && isRecordInURL===item.$id) {
	// 		setIsOpen(true)
	// 	}else{
	// 		setIsOpen(false)
	// 	}
	// }, [searchParams]);

	// const onClose = () =>{
	// 	setIsOpen(false)
	// 	const newParams = new URLSearchParams(searchParams);
	// 	newParams.delete('record');
	// 	router.push(`?${newParams.toString()}`, { shallow: true });
	// }
	//
	// useEffect(() => {
	// 	let id = searchParams.get('record')
	// 	if (id === item.$id) {
	// 		setIsOpen(true);
	// 	}else{
	// 		setIsOpen(false)
	// 	}
	// }, [searchParams]);

	return (
		<Sheet
			open={isOpen}
			onOpenChange={setIsOpen}
			defaultOpen={false}
		>
			<SheetTrigger className={'w-full outline-none'}>
				<div
					onClick={() => setIsOpen(true)}
					className="flex flex-col w-full px-6 hover:bg-muted select-none py-4 cursor-pointer border-b"
				>
					<div className="flex w-full justify-between gap-5 text-left">
						<UIText
							isUrdu={isStringUrdu(item.name)}
							className={cn(
								'rtl:text-right',
								isStringUrdu(item.name) ? 'font-urdu ltr:text-2xl' : 'rtl:font-sans rtl:font-medium rtl:text-lg'
							)}
						>
							{item.name}
						</UIText>

						<div className="flex gap-2 justify-end items-center relative flex-shrink-0 select-none" dir={'ltr'}>
							<span className="text-sm select-none font-semibold">Rs</span>
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
						<div className={'flex items-center gap-2 mt-1'}>
							<CornerDownRight className={'w-5 h-5 text-muted-foreground rtl:hidden'}/>
							<CornerDownLeft className={'w-5 h-5 text-muted-foreground ltr:hidden'}/>
							<UIText
								isUrdu={isStringUrdu(item.details)}
								className={cn(
									'overflow-hidden line-clamp-1 mt-1 w-3/4 text-muted-foreground text text-left rtl:text-right',
									isStringUrdu(item.details) ? 'font-urdu rtl:text-xl' : 'rtl:font-sans rtl:text-base'
								)}
							>
								{item.details}
							</UIText>
						</div>
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
						<UIText
							isUrdu={isStringUrdu(item.name)}
							className={cn(
								isStringUrdu(item.name) ? 'font-urdu ltr:text-3xl rtl:!text-3xl' : 'rtl:font-sans rtl:font-medium rtl:text-lg'
							)}
						>
							{item.name}
						</UIText>

						<div className="flex text-foreground gap-2 mt-8 justify-center items-center relative select-none pointer-events-none" dir={'ltr'}>
							<span className="text-lg font-semibold">Rs</span>
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
								<UIText className={'mb-2 text-primary'} weight={'semibold'}>{t('labelItemDetails')}</UIText>
								<UIText className={cn(
									isStringUrdu(item.details) ? 'font-urdu' : 'rtl:font-sans rtl:text-base'
								)}>{item.details}</UIText>
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
