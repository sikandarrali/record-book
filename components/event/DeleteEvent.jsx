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

export const DeleteEvent = ({ open, onOpenChange, onDelete, eventName }) => {
	const t = useScopedI18n('events')
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
				<AlertDialogHeader className={'!text-left'}>
					<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2 font-normal'}>
						<TriangleAlert className={'w-5 h-5'}/>
						<UIText variant={'heading'}>{t('deleteEvent')}</UIText>
					</AlertDialogTitle>
					<AlertDialogDescription className={"flex flex-col text-base items-center gap-1 !my-5"}>
						<UIText>{t('deleteEventText')}</UIText>
						<UIText className={'text-primary'} weight={'semibold'}>{eventName}</UIText>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
			</AlertDialogContent>
		</AlertDialog>
	);
};
