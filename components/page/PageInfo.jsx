import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {SquarePen} from "lucide-react";
import { useRouter } from "next/navigation";
import {useLayoutEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import { EditPage } from "./EditPage";
import {db} from "@/components/appwrite/database";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Query} from "appwrite";
import {useI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {useData} from "@/components/contexts/DataContext";
import {EnglishMonths} from "@/lib/defaultData";
import {useAuth} from "@/components/contexts/AuthContext";
import {DeleteDialog} from "@/components/theme/DeleteDialog";
import {PARENT_FIELD_IN_SINGLE_RECORD} from "@/components/appwrite/appwrite";
import {CreatedUpdatedBy} from "@/components/theme/CreatedUpdatedBy";
import {HOMEPAGE_ROUTE} from "@/lib/routes";
import {UISheet} from "@/components/theme/UISheet";
import {Badge} from "@/components/ui/badge";
import {PopupPageCreatedByYou} from "@/components/theme/PopupPageCreatedByYou";
import {PopupPageSharedWithGroup} from "@/components/theme/PopupPageSharedWithGroup";

const PageInfo = ({ pageData, setPageData, sum }) => {
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();
	const [group, setGroup] = useState(null)
	const t = useI18n()
	const {userGroups} = useData()
	const {user} = useAuth()

	const hasDeletePermission =  pageData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`)

	const onDelete = async () => {
		await db.pages.delete(pageData?.$id);
		await DeleteAllItemsInThisEvent()
		setOpenDelete(false);
		setOpenDetails(false);
		toast.success(t('alerts.deleted'), ToastOptions);
		router.replace(HOMEPAGE_ROUTE);
	};

	const DeleteAllItemsInThisEvent = async () => {
		const getItems = await db.records.list([
			Query.orderDesc("$createdAt"),
			Query.equal(PARENT_FIELD_IN_SINGLE_RECORD, pageData?.$id)
		]);
		// Iterate over each document and delete it
		for (const item of getItems.documents) {
			await db.records.delete(item.$id);
		}
	};

	// set group
	useLayoutEffect(() => {
		const unsub = async () =>{
			if(pageData?.teamId){
				const response = userGroups.find((item)=> item.$id === pageData?.teamId)
				setGroup(response)
			}else{
				setGroup(null)
			}
		}
		unsub()
	}, [openDetails]);

	// Parse the date string
	const date = new Date(pageData?.date);
	const year = date.getFullYear();
	const day = date.getDate();
	const monthIndex = date.getMonth(); // getMonth() returns a zero-based index (0 for January, 11 for December)
	const month = EnglishMonths[monthIndex];

	const createdAtDate = new Date(pageData?.$createdAt);
	const renderedCreatedDate = {
		year: createdAtDate.getFullYear(),
		day: createdAtDate.getDate(),
		month: EnglishMonths[createdAtDate.getMonth()],
		hours: String(createdAtDate.getHours()).padStart(2, '0'),
		minutes: String(createdAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(createdAtDate.getSeconds()).padStart(2, '0')
	}

	const updatedAtDate = new Date(pageData?.$updatedAt);
	const renderedUpdatedDate = {
		year: updatedAtDate.getFullYear(),
		day: updatedAtDate.getDate(),
		month: EnglishMonths[updatedAtDate.getMonth()],
		hours: String(updatedAtDate.getHours()).padStart(2, '0'),
		minutes: String(updatedAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(updatedAtDate.getSeconds()).padStart(2, '0')
	}

	const deleteTexts = [
		<UIText key={1} text={t('pages.home.deletePageText')}/>,
		<UIText key={2} variant={'lg'} className={'!text-primary'} weight={'semibold'} text={pageData?.name}/>
	]

	return (
		<>
			{/* Page Info Button */}
			<Button
				onClick={()=> setOpenDetails(true)}
				variant={'outline'}
				size={'icon'}
			>
				<SquarePen className={'w-5 h-5 text-primary'} />
			</Button>

			<UISheet
				open={openDetails}
				onOpenChange={setOpenDetails}
				defaultOpen={false}
			>
				{/* Name & Badges */}
				<div className={'flex items-center text-primary'} dir={'ltr'}>
					{pageData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`) &&
						<PopupPageCreatedByYou side={'right'} align={'start'} className={'max-w-56 bg-muted'}/>
					}

					{/* Book Type */}
					<div className={'flex justify-center flex-1'}>
						{pageData?.type === "khaataBook" &&
							<Badge variant={'secondary'} className={'px-2 py-1.5'}>
								<UIText text={t('labels.khaataBook')} variant={'xs'}/>
							</Badge>
						}
						{pageData?.type === "recordBook" &&
							<Badge variant={'secondary'} className={'px-2 py-1.5'}>
								<UIText text={t('labels.recordBook')} variant={'xs'}/>
							</Badge>
						}
					</div>

					{pageData?.teamId &&
						<PopupPageSharedWithGroup teamId={pageData?.teamId} side={'left'} align={'start'} className={'flex bg-muted flex-col gap-2'}/>
					}
				</div>

				{/* Amount */}
				<div className="flex flex-col justify-center text-center items-center gap-5 mt-10 mb-10 lg:mt-32">
					<UIText variant={"heading"} text={pageData?.name} className={'break-all'}/>

					<div className="flex flex-1 justify-center col-span-4 items-center gap-2 relative select-none pointer-events-none" dir={'ltr'}>
						<span className="text-sm font-semibold">Rs</span>
						<UIText
							className="!text-primary"
							weight={'semibold'}
							variant={'heading'}
							text={
								<NumericFormat
									allowNegative={false}
									value={Number(sum)}
									thousandSeparator={","}
									decimalSeparator={"."}
									displayType="text"
									decimalScale={2}
								/>
							}
						/>
					</div>
				</div>

				{/* Page Data */}
				<div className={'flex flex-col divide-y divide-muted lg:mt-16'}>

					{/* Group */}
					<div className={'flex py-4 items-center'}>
						<div className={'w-1/4 flex shrink-0'}>
							<UIText weight={'medium'} text={t('labels.group')}/>
						</div>
						<div className={'w-3/4 flex items-center pl-4'}>
							{group?.name ?
								<UIText variant={'label'} className={'!text-primary'} text={group?.name}/>
								:
								<UIText variant={'label'} text={t('labels.notSharedWithGroup')}/>
							}
						</div>
					</div>

					{/* Date */}
					<div className={'flex py-4 items-center'}>
						<div className={'w-1/4 flex shrink-0'}>
							<UIText weight={'medium'} text={t('labels.date')}/>
						</div>
						<div className={'w-3/4 flex items-center pl-4'}>
							{pageData?.date ? <UIText text={`${day} ${t(`months.${month.toLowerCase()}`)+t('general.comma')} ${year}`}/> : '-'}
						</div>
					</div>

					{/* Details */}
					<div className={'flex py-4 items-center'}>
						<div className={'w-1/4 flex shrink-0'}>
							<UIText weight={'medium'} text={t('labels.details')}/>
						</div>
						<div className={'w-3/4 flex items-center pl-4'}>
							<UIText text={pageData?.details || '-'}/>
						</div>
					</div>

					{/* Created Updated BY */}
					<CreatedUpdatedBy data={pageData} createdDate={renderedCreatedDate} updatedDate={renderedUpdatedDate}/>
				</div>

				<UISheetInfoFooter
					setOpen={setOpenDetails}
					setOpenDelete={setOpenDelete}
					setOpenEdit={setOpenEdit}
					hasDeletePermission={hasDeletePermission}
				/>
			</UISheet>

			<EditPage
				open={openEdit}
				onOpenChange={setOpenEdit}
				pageData={pageData}
				setPageData={setPageData}
				setGroup={setGroup}
			/>
			{hasDeletePermission &&
				<DeleteDialog
					open={openDelete}
					onOpenChange={setOpenDelete}
					onDelete={onDelete}
					title={t('pages.home.deletePage')}
					texts={deleteTexts}
				/>
			}
		</>
	);
};

export default PageInfo;


