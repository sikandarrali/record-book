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

export const DeleteGroup = ({ open, onOpenChange, groupName, onDelete }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
				<AlertDialogHeader className={'!text-left'}>
					<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2'}>
						<TriangleAlert className={'w-5 h-5'}/>
						<span>Delete Group</span>
					</AlertDialogTitle>
					<AlertDialogDescription className={"flex flex-col text-base items-center gap-1 !my-5"}>
						<span>This will permanently delete</span>
						<span className={'font-semibold text-primary'}>{groupName}</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
			</AlertDialogContent>
		</AlertDialog>
	);
};
