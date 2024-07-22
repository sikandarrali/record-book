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
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

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
			<SheetTrigger className={'w-full outline-none'}>
				<div
					onClick={() => setIsOpen(true)}
					className="flex flex-col w-full px-6 hover:bg-muted select-none py-4 cursor-pointer border-b"
				>
					<div className="flex w-full justify-between gap-5">
						<UIText variant={'lg'} weight={'medium'} text={item.name}/>

						<div className="flex gap-2 justify-end items-center relative shrink-0 select-none" dir={'ltr'}>
							<span className="text-sm select-none font-semibold">Rs</span>
							<UIText
								weight={'semibold'}
								variant={'lg'}
								className="text-primary"
								text={
									<NumericFormat
										allowNegative={false}
										value={item.amount}
										thousandSeparator={","}
										decimalSeparator={"."}
										displayType="text"
										decimalScale={2}
									/>
								}
							/>
						</div>
					</div>

					{item.details &&
						<div className={'flex items-center gap-2 mt-1'}>
							<CornerDownRight className={'w-5 h-5 mt-1 text-muted-foreground rtl:hidden'}/>
							<CornerDownLeft className={'w-5 h-5 mt-1 text-muted-foreground ltr:hidden'}/>
							<p className={'overflow-hidden line-clamp-1 w-3/4 text-muted-foreground text text-left rtl:text-right'}>
								<UIText text={item.details}/>
							</p>
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
						<UIText weight={'medium'} variant={'lg'} className={'!text-center'} text={item.name}/>

						<div className="flex text-foreground gap-2 mt-8 justify-center items-center relative select-none pointer-events-none" dir={'ltr'}>
							<span className="text-lg font-semibold">Rs</span>
							<UIText
								weight={'bold'}
								className="text-primary"
								variant={'heading'}
								text={
									<NumericFormat
										allowNegative={false}
										value={item.amount}
										thousandSeparator={","}
										decimalSeparator={"."}
										displayType="text"
										decimalScale={2}
									/>
								}
							/>
						</div>

						{item.details &&
							<div className={'mt-20 mb-10 self-start flex flex-col px-2'}>
								<UIText className={'mb-2 text-primary'} weight={'semibold'} text={t('labelItemDetails')}/>
								<UIText text={item.details} />
							</div>
						}
					</div>
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1" className={'border-0 px-2 mt-10 w-full'}>
							<AccordionTrigger className={'text-muted-foreground hover:no-underline'}>
								<UIText text={t('eventItemInfo.labelViewCreatedEditedBy')}/>
							</AccordionTrigger>

							<AccordionContent className={'divide-y'}>
								<div className={'flex py-4'}>
									<div className={'w-1/4 flex flex-col shrink-0'}>
										<UIText className={'text-muted-foreground'} variant={'sm'} text={t('eventItemInfo.addedBy')}/>
									</div>
									<div className={'w-3/4 flex flex-col pl-4'}>
										<UIText variant={'sm'} weight={'semibold'} className={'!text-left'} text={item?.createdBy[0] || '-'}/>
										<UIText variant={'xs'} text={item?.createdBy[1] || '-'}/>
										<UIText variant={'xs'} text={t('eventItemInfo.at')} className={'mt-1 mb-2 rtl:self-end text-muted-foreground'}/>
										<UIText variant={'xs'} text={item.$createdAt}/>
									</div>
								</div>
								{item?.updatedBy[0] &&
									<div className={'flex py-4'}>
										<div className={'w-1/4 flex flex-col shrink-0'}>
											<UIText className={'text-muted-foreground'} variant={'sm'} text={t('eventItemInfo.updatedBy')}/>
										</div>
										<div className={'w-3/4 flex flex-col pl-4'}>
											<UIText variant={'sm'} weight={'semibold'} text={item?.updatedBy[0] || '-'}/>
											<UIText variant={'xs'} text={item?.updatedBy[1] || '-'}/>
											<UIText variant={'xs'} text={t('eventItemInfo.at')} className={'mt-1 mb-2 rtl:self-end text-muted-foreground'}/>
											<UIText variant={'xs'} text={item.$updatedAt}/>
										</div>
									</div>
								}
							</AccordionContent>
						</AccordionItem>
					</Accordion>

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
