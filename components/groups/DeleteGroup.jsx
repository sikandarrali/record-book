"use client";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {TriangleAlert} from "lucide-react";
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const DeleteGroup = ({ open, onOpenChange, groupName, onDelete }) => {
	const t = useScopedI18n('groups')
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
				<AlertDialogHeader className={'!text-left'}>
					<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2 font-normal'}>
						<TriangleAlert className={'w-4 h-4'}/>
						<UIText weight={'semibold'} text={t('deleteGroup')}></UIText>
					</AlertDialogTitle>
					<AlertDialogDescription className={"flex flex-col text-base items-center gap-4 !my-5"}>
						<UIText text={t('deleteGroupText')}/>
						<UIText variant={'lg'} className={'text-primary'} weight={'semibold'} text={groupName}/>
						<UIText text={t('deleteGroupUpdateEventText')}/>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
			</AlertDialogContent>
		</AlertDialog>
	);
};
