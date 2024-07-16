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
							<UIText variant={'heading'}>{t('deleteGroupMember')}</UIText>
						</AlertDialogTitle>
						<AlertDialogDescription className={"flex flex-col text-base text-center items-center gap-1 !my-5"}>
							<UIText>{t('deleteGroupMemberText1')}</UIText>
							<UIText className={'text-primary'}>{userEmail}</UIText>
							<UIText>{t('deleteGroupMemberText2')}{groupName}</UIText>
							<UIText className={'mt-4 font-semibold'}>{t('deleteGroupMemberText3')}</UIText>
						</AlertDialogDescription>
					</AlertDialogHeader>

					<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange} actionLabel={t('btnYesRemove')}/>
				</AlertDialogContent>
			</AlertDialog>


			{/*<AlertDialogContent className={"w-[90%] rounded-xl"}>*/}
			{/*	<AlertDialogHeader>*/}
			{/*		<AlertDialogTitle className={'text-primary'}>Remove User</AlertDialogTitle>*/}
			{/*		<AlertDialogDescription className={"mt-2 flex flex-col gap-1"}>*/}
			{/*			<span>Do you really want to remove </span>*/}
			{/*			<span className={'font-semibold'}>{userEmail}</span>*/}
			{/*			<span>from Group.</span>*/}
			{/*			<span className={'text-primary'}>They will not be able to access Events Data anymore.</span>*/}
			{/*		</AlertDialogDescription>*/}
			{/*	</AlertDialogHeader>*/}

			{/*	<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>*/}
			{/*</AlertDialogContent>*/}
		</AlertDialog>
	);
};
