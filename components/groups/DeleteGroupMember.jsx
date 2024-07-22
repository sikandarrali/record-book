"use client";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";
import {TriangleAlert} from "lucide-react";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const DeleteGroupMember = ({ open, onOpenChange, userEmail, onDelete, groupName }) => {
	const t = useScopedI18n('groups')
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialog open={open} onOpenChange={onOpenChange}>
				<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
					<AlertDialogHeader className={'!text-left'}>
						<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2'}>
							<TriangleAlert className={'w-5 h-5'}/>
							<UIText variant={'heading'} text={t('deleteGroupMember')}/>
						</AlertDialogTitle>
						<AlertDialogDescription className={"flex flex-col text-base text-center items-center gap-4 !my-5"}>
							<UIText text={t('deleteGroupMemberText1')}/>
							<UIText className={'text-primary'} text={userEmail}/>
							<UIText text={t('deleteGroupMemberText2') + groupName}></UIText>
							<UIText className={'mt-4 font-semibold'} text={t('deleteGroupMemberText3')}/>
						</AlertDialogDescription>
					</AlertDialogHeader>

					<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange} actionLabel={t('btnYesRemove')}/>
				</AlertDialogContent>
			</AlertDialog>
		</AlertDialog>
	);
};
