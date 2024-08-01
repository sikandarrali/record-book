"use client";
import { db } from "@/components/appwrite/database";
import UIText from "@/components/theme/UIText";
import {CornerDownLeft, CornerDownRight, Minus, Plus} from "lucide-react";
import {useState} from "react";
import { NumericFormat } from "react-number-format";
import { EditDiaryRecord } from "./EditDiaryRecord";
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
import {cn, getCurrentCurrency} from "@/lib/utils";
import {useI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {EnglishMonths} from "@/lib/defaultData";
import {useAuth} from "@/components/contexts/AuthContext";
import {CreatedUpdatedBy} from "@/components/theme/CreatedUpdatedBy";
import {DeleteDialog} from "@/components/theme/DeleteDialog";
import {Button} from "@/components/ui/button";
import {UISheet} from "@/components/theme/UISheet";
import {Badge} from "@/components/ui/badge";
import {UrduDate} from "@/lib/UrduDate";
import {FormattedCurrency} from "@/components/theme/FormattedCurrency";

export const SingleDiaryRecord = ({ item, bookCurrency }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
	const [isOpen, setIsOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const t = useI18n()
	const {user} = useAuth()
	const hasDeletePermission =  item.$permissions.some(permission => permission === `delete("user:${user.$id}")`)


	const onDelete = async () => {
		setOpenDelete(false);
		setIsOpen(false);
		await db.diariesRecords.delete(item.$id);
		toast.success(t('alerts.deleted'), ToastOptions);
	};

	const deleteTexts = [
		<UIText key={1} text={t('pages.records.deletePageText')}/>,
		<UIText key={2} variant={'lg'} className={'text-primary'} weight={'semibold'} text={item?.name}/>
	]

	const createdAtDate = new Date(item?.$createdAt);
	const renderedCreatedDate = {
		year: createdAtDate.getFullYear(),
		day: createdAtDate.getDate(),
		month: EnglishMonths[createdAtDate.getMonth()],
		hours: String(createdAtDate.getHours()).padStart(2, '0'),
		minutes: String(createdAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(createdAtDate.getSeconds()).padStart(2, '0')
	}

	const updatedAtDate = new Date(item?.$updatedAt);
	const renderedUpdatedDate = {
		year: updatedAtDate.getFullYear(),
		day: updatedAtDate.getDate(),
		month: EnglishMonths[updatedAtDate.getMonth()],
		hours: String(updatedAtDate.getHours()).padStart(2, '0'),
		minutes: String(updatedAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(updatedAtDate.getSeconds()).padStart(2, '0')
	}

	return (
		<>
			{/* Trigger */}
			<div
				onClick={() => setIsOpen(true)}
				className="flex flex-col py-8 px-4 w-full select-none cursor-pointer border-b hover:rounded-md border-border hover:bg-muted"
			>
				<UIText variant={'heading'} weight={'medium'} text={item.name} className={cn(item.markedAsDone && "line-through")} />
			</div>

			<UISheet
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">

					<div className="flex flex-col justify-center items-center my-8 lg:mt-10">
						{/* Name */}
						<UIText weight={'medium'} variant={'lg'} className={'!text-center'} text={item.name}/>
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

			<EditDiaryRecord
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
