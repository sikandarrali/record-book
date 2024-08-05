import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {SquarePen} from "lucide-react";
import { useRouter } from "next/navigation";
import {useLayoutEffect, useState} from "react";
import { EditDiary } from "./EditDiary";
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
import {PARENT_DIARY_ID_FIELD_NAME} from "@/components/appwrite/appwrite";
import {CreatedUpdatedBy} from "@/components/theme/CreatedUpdatedBy";
import {HOMEPAGE_ROUTE} from "@/lib/routes";
import {UISheet} from "@/components/theme/UISheet";
import {Badge} from "@/components/ui/badge";
import {PopupPageCreatedByYou} from "@/components/theme/PopupPageCreatedByYou";
import {PopupPageSharedWithGroup} from "@/components/theme/PopupPageSharedWithGroup";

const DiaryInfo = ({ diaryData, setDiaryData, sum }) => {
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();
	const [group, setGroup] = useState(null)
	const t = useI18n()
	const {userGroups} = useData()
	const {user} = useAuth()

	const hasDeletePermission =  diaryData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`)

	const onDelete = async () => {
		await db.diaries.delete(diaryData?.$id);
		await DeleteAllItemsInThisDiary()
		setOpenDelete(false);
		setOpenDetails(false);
		toast.success(t('alerts.deleted'), ToastOptions);
		router.replace(HOMEPAGE_ROUTE);
	};

	const DeleteAllItemsInThisDiary = async () => {
		const getItems = await db.diariesRecords.list([
			Query.orderDesc("$createdAt"),
			Query.equal(PARENT_DIARY_ID_FIELD_NAME, diaryData?.$id)
		]);
		// Iterate over each document and delete it
		for (const item of getItems.documents) {
			await db.diariesRecords.delete(item.$id);
		}
	};

	// set group
	useLayoutEffect(() => {
		const unsub = async () =>{
			if(diaryData?.teamId){
				const response = userGroups.find((item)=> item.$id === diaryData?.teamId)
				setGroup(response)
			}else{
				setGroup(null)
			}
		}
		unsub()
	}, [openDetails]);

	// Parse the date string
	const date = new Date(diaryData?.date);
	const year = date.getFullYear();
	const day = date.getDate();
	const monthIndex = date.getMonth(); // getMonth() returns a zero-based index (0 for January, 11 for December)
	const month = EnglishMonths[monthIndex];

	const createdAtDate = new Date(diaryData?.$createdAt);
	const renderedCreatedDate = {
		year: createdAtDate.getFullYear(),
		day: createdAtDate.getDate(),
		month: EnglishMonths[createdAtDate.getMonth()],
		hours: String(createdAtDate.getHours()).padStart(2, '0'),
		minutes: String(createdAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(createdAtDate.getSeconds()).padStart(2, '0')
	}

	const updatedAtDate = new Date(diaryData?.$updatedAt);
	const renderedUpdatedDate = {
		year: updatedAtDate.getFullYear(),
		day: updatedAtDate.getDate(),
		month: EnglishMonths[updatedAtDate.getMonth()],
		hours: String(updatedAtDate.getHours()).padStart(2, '0'),
		minutes: String(updatedAtDate.getMinutes()).padStart(2, '0'),
		seconds: String(updatedAtDate.getSeconds()).padStart(2, '0')
	}

	const deleteTexts = [
		<UIText key={1} text={t('pages.books.deletePageText')}/>,
		<UIText key={2} variant={'lg'} className={'!text-primary'} weight={'semibold'} text={diaryData?.name}/>
	]

	return (
		<>
			{/* Page Info Button */}
			<Button
				onClick={()=> setOpenDetails(true)}
				variant={'outline'}
				// size={'icon'}
				className={'px-3 gap-2'}
			>
				<SquarePen className={'w-4 h-4 text-primary'} />
				<UIText text={t('labels.edit')} variant={'xs'}/>
			</Button>

			<UISheet
				open={openDetails}
				onOpenChange={setOpenDetails}
				defaultOpen={false}
			>
				{/* Name & Badges */}
				<div className={'flex relative items-center justify-between text-primary'} dir={'ltr'}>
					{diaryData?.$permissions.some(permission => permission === `delete("user:${user.$id}")`) &&
						<PopupPageCreatedByYou side={'right'} align={'start'} className={'max-w-56 bg-muted'}/>
					}

					{/* Diary Badge */}
					<Badge className={'absolute position-center-horizontally'}><UIText text={t("pages.diaries.titleDiary")} variant={'xs'}/></Badge>

					{diaryData?.teamId &&
						<PopupPageSharedWithGroup teamId={diaryData?.teamId} side={'left'} align={'start'} className={'flex bg-muted flex-col gap-2'}/>
					}
				</div>

				{/* Name */}
				<div className="flex flex-col justify-center text-center items-center gap-5 mt-10 mb-10">
					<UIText variant={"heading"} text={diaryData?.name} className={'break-all text-primary'}/>
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

					{/* Created Updated BY */}
					<CreatedUpdatedBy data={diaryData} createdDate={renderedCreatedDate} updatedDate={renderedUpdatedDate}/>
				</div>

				<UISheetInfoFooter
					setOpen={setOpenDetails}
					setOpenDelete={setOpenDelete}
					setOpenEdit={setOpenEdit}
					hasDeletePermission={hasDeletePermission}
				/>
			</UISheet>

			<EditDiary
				open={openEdit}
				onOpenChange={setOpenEdit}
				diaryData={diaryData}
				setDiaryData={setDiaryData}
				setGroup={setGroup}
			/>
			{hasDeletePermission &&
				<DeleteDialog
					open={openDelete}
					onOpenChange={setOpenDelete}
					onDelete={onDelete}
					title={t('pages.books.deletePage')}
					texts={deleteTexts}
				/>
			}
		</>
	);
};

export default DiaryInfo;


