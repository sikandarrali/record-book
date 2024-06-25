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

export const DeleteEvent = ({ open, onOpenChange, onDelete, eventName }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange} modal={false}>
			<AlertDialogContent className={"w-[90%]"}>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete <span className={'font-semibold text-primary text-xl'}>{eventName}</span> Event?</AlertDialogTitle>
					<AlertDialogDescription className={"mt-2"}>
						This will permanently delete{" "}
						<span className={'font-semibold'}>{eventName}</span>
						{" "}and remove all its records.<br/>
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
