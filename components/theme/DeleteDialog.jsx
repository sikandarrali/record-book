import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {TriangleAlert} from "lucide-react";
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";
import {useI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const DeleteDialog = ({ open, onOpenChange, onDelete, title, texts }) => {
	const t = useI18n()
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
				<AlertDialogHeader className={'!text-left'}>
					<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2 font-normal'}>
						<TriangleAlert className={'w-5 h-5'}/>
						<UIText variant={'heading'} text={title}/>
					</AlertDialogTitle>
					<AlertDialogDescription className={"flex flex-col text-base items-center gap-4 !my-5"}>
						{texts?.map((text,i)=> (
							<span key={i}>{text}</span>
						))}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
			</AlertDialogContent>
		</AlertDialog>
	);
};
