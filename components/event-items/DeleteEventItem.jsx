"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {TriangleAlert} from "lucide-react";
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";

export const DeleteEventItem = ({ open, onOpenChange, personName, onDelete }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
				<AlertDialogHeader className={'!text-left'}>
					<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2'}>
						<TriangleAlert className={'w-5 h-5'}/>
						<span>Delete Event Data</span>
					</AlertDialogTitle>
					<AlertDialogDescription className={"flex flex-col text-base items-center gap-1 !my-5"}>
						<span>This will permanently delete this data entry</span>
						<span className={'font-semibold text-primary'}>{personName}</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
			</AlertDialogContent>
		</AlertDialog>
	);
};
