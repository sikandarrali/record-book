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

export const DeleteEventItem = ({ open, onOpenChange, personName, onDelete }) => {
	const t = useScopedI18n('events')
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
				<AlertDialogHeader className={''}>
					<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2 font-normal'}>
						<TriangleAlert className={'w-5 h-5'}/>
						<UIText variant={'heading'}>{t('deleteEventItem')}</UIText>
					</AlertDialogTitle>
					<AlertDialogDescription className={"flex flex-col text-base items-center gap-1 !my-5"}>
						<UIText>{t('deleteEventItemText')}</UIText>
						<UIText className={'text-primary'} weight={'semibold'}>{personName}</UIText>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
			</AlertDialogContent>
		</AlertDialog>
	);
};
