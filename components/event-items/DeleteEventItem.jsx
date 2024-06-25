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
import * as Yup from "yup";

export const DeleteEventItem = ({ open, onOpenChange, personName, onDelete }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl"}>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete record of <span className={'font-semibold text-primary text-xl'}>{personName}</span>?</AlertDialogTitle>
					<AlertDialogDescription className={"mt-2"}>
						This will permanently delete{" "}
						<span className={'font-semibold'}>{personName}{`'s`}</span>
						{" "}record.<br/>
						<span className={'font-semibold text-muted-foreground'}>This action is permanent cannot be undone.</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className={'!flex-row items-center justify-center gap-4'}>
					<AlertDialogAction onClick={() => onOpenChange(false)}>
						Cancel
					</AlertDialogAction>
					<AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
						Yes, Delete
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
