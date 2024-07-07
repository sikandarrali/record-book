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
import Text from "@/components/theme/Text";

export const DeleteGroup = ({ open, onOpenChange, groupName, onDelete }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl"}>
				<AlertDialogHeader>
					<AlertDialogTitle className={'text-primary'}>Delete Group</AlertDialogTitle>
					<AlertDialogDescription className={"mt-2 flex flex-col gap-1"}>
						<span>Do you really want to delete </span>
						<span className={'font-semibold'}>{groupName}</span>
						<span variant={'sm'} className={'text-primary'}>This action is permanent and cannot be reversed.</span>
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
