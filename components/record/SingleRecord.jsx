"use client";
import { db } from "@/components/appwrite/database";
import UIText from "@/components/theme/UIText";
import {CornerDownLeft, CornerDownRight} from "lucide-react";
import {useState} from "react";
import { EditRecord } from "./EditRecord";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {cn, getCurrentCurrency} from "@/lib/utils";
import {useI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {EnglishMonths} from "@/lib/defaultData";
import {useAuth} from "@/components/contexts/AuthContext";
import {CreatedUpdatedBy} from "@/components/theme/CreatedUpdatedBy";
import {DeleteDialog} from "@/components/theme/DeleteDialog";
import {UISheet} from "@/components/theme/UISheet";
import {Badge} from "@/components/ui/badge";
import {UrduDate} from "@/lib/UrduDate";
import {FormattedCurrency} from "@/components/theme/FormattedCurrency";

export const SingleRecord = ({ item, bookCurrency }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const t = useI18n()
	const {user} = useAuth()
	const hasDeletePermission =  item.$permissions.some(permission => permission === `delete("user:${user.$id}")`)


	const onDelete = async () => {
		setOpenDelete(false);
		setIsOpen(false);
		await db.records.delete(item.$id);
		toast.success(t('alerts.deleted'), ToastOptions);
	};

	const createdAtDate = new Date(item.$createdAt);
	const renderedCreatedDate = {
		year: createdAtDate.getFullYear(),
		day: createdAtDate.getDate(),
		month: EnglishMonths[createdAtDate.getMonth()],
		hours: String(createdAtDate.getHours()).padStart(2, '0'),
		minutes: String(createdAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(createdAtDate.getSeconds()).padStart(2, '0')
	}

	const updatedAtDate = new Date(item.$updatedAt);
	const renderedUpdatedDate = {
		year: updatedAtDate.getFullYear(),
		day: updatedAtDate.getDate(),
		month: EnglishMonths[updatedAtDate.getMonth()],
		hours: String(updatedAtDate.getHours()).padStart(2, '0'),
		minutes: String(updatedAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(updatedAtDate.getSeconds()).padStart(2, '0')
	}

	const deleteTexts = [
		<UIText key={1} text={t('pages.records.deletePageText')}/>,
		<UIText key={2} variant={'lg'} className={'text-primary'} weight={'semibold'} text={item?.name}/>
	]

	return (
		<>
			{/* Trigger */}
			<div
				onClick={() => setIsOpen(true)}
				className="flex flex-col w-full px-8 select-none py-4 cursor-pointer hover:bg-muted shadow-sm border-b border-border"
			>
				<div className="flex w-full justify-between gap-4 flex-col lg:flex-row">
					<div className={'flex flex-col gap-1'}>
						{item?.date &&
							<UIText text={UrduDate(item.date).day} variant={'sm'} className={'text-muted-foreground mb-2'} />
						}

						<UIText variant={'heading'} weight={'medium'} text={item.name}/>


						{item.details && item.details !== ""  && item.details !== " " &&
							<div className={'flex items-center gap-2 mt-1'}>
								<CornerDownRight className={'w-5 h-5 mt-1 text-muted-foreground rtl:hidden'}/>
								<CornerDownLeft className={'w-5 h-5 mt-1 text-muted-foreground ltr:hidden'}/>
								<p className={'overflow-hidden line-clamp-1 w-3/4 text-muted-foreground text text-left rtl:text-right'}>
									<UIText text={item.details}/>
								</p>
							</div>
						}
					</div>

					<div className="flex justify-end self-end items-center relative shrink-0 select-none" dir={'ltr'}>
						<UIText
							weight={'semibold'}
							variant={'heading'}
							className={cn(item.type==='expense' && "text-destructive")}
							text={
								<FormattedCurrency
									value={item.amount}
									currency={getCurrentCurrency(bookCurrency)}
									type={item.type}
								/>
							}
						/>
					</div>
				</div>
			</div>

			<UISheet
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">

				<div className="flex flex-col justify-center items-center my-8 lg:mt-10">

					{/* date */}
					{item?.date &&
						<Badge variant={'outline'} className={'self-start mb-10'}>
							<UIText variant={'button'} text={UrduDate(item?.date).day}/>
						</Badge>
					}

					{/* Name */}
					<UIText weight={'medium'} variant={'heading'} className={'!text-center'} text={item.name}/>

					{/* Amount */}
					<div className="flex mt-8 justify-center items-center relative select-none pointer-events-none" dir={'ltr'}>
						<UIText
							weight={'bold'}
							className={cn(item.type==='expense' ? "text-destructive" : "text-primary")}
							variant={'heading'}
							text={
								<FormattedCurrency
									value={item.amount}
									currency={getCurrentCurrency(bookCurrency)}
									type={item.type}
								/>
							}
						/>
					</div>

					{/* Details */}
					{item.details &&
						<div className={'!mt-20 self-start flex flex-col px-2'}>
							<UIText className={'mb-2 text-primary'} weight={'semibold'} text={t('labels.details')}/>
							<UIText text={item.details} />
						</div>
					}
				</div>

				{/*	Created Updated By*/}
				<div className={'mt-10'}>
					<CreatedUpdatedBy data={item} createdDate={renderedCreatedDate} updatedDate={renderedUpdatedDate}/>
				</div>

				<UISheetInfoFooter
					setOpen={setIsOpen}
					setOpenDelete={setOpenDelete}
					setOpenEdit={setOpenEdit}
					hasDeletePermission={hasDeletePermission}
				/>
			</div>
			</UISheet>

			<EditRecord
				item={item}
				open={openEdit}
				onOpenChange={setOpenEdit}
				currency={bookCurrency}
			/>
			{hasDeletePermission &&
				<DeleteDialog
					open={openDelete}
					onOpenChange={setOpenDelete}
					onDelete={onDelete}
					title={t('pages.records.deletePage')}
					texts={deleteTexts}
				/>
			}
		</>
	);
};
