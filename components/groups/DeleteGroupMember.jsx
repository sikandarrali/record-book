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

export const DeleteGroupMember = ({ open, onOpenChange, userEmail, onDelete }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className={"w-[90%] rounded-xl"}>
				<AlertDialogHeader>
					<AlertDialogTitle className={'text-primary'}>Remove User</AlertDialogTitle>
					<AlertDialogDescription className={"mt-2 flex flex-col gap-1"}>
						<span>Do you really want to remove </span>
						<span className={'font-semibold'}>{userEmail}</span>
						<span>from Group.</span>
						<span className={'text-primary'}>They will not be able to access Events Data anymore.</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className={'!flex-row items-center justify-center gap-4'}>
					<AlertDialogAction onClick={() => onOpenChange(false)}>
						Cancel
					</AlertDialogAction>
					<AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
						Yes, Remove
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
