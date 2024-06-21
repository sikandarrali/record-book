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

const AddEventItemSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	amount: Yup.string()
		.min(1)
		.max(100, "max 100 characters")
		.required("required"),
	details: Yup.string().min(1).max(500, "max 500 characters"),
});
export const DeleteEventItem = ({ open, onOpen, deleteID, onDelete }) => {
	return (
		<AlertDialog open={open} onOpen={onOpen}>
			<AlertDialogContent className="max-w-[90%]">
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your items from our
						servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={() => onDelete(deleteID)}>
						Yes, Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
