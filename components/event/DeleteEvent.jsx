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
import { useMyStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";

export const DeleteEvent = ({ open, onOpen, deleteID }) => {
	const router = useRouter();
	const { toast } = useToast();
	const deleteEventStore = useMyStore((state) => state.deleteEvent);

	const onDelete = async () => {
		await db.events.delete(deleteID);
		deleteEventStore(deleteID);
		toast({
			title: "Event Deleted.",
			variant: "success",
		});
		onOpen(false);
		router.replace("/events");
	};

	const DeleteAllItemsInThisEvent = async () => {
		const promises = [];
		const getItems = await db.eventItems.list([
			Query.orderDesc("$createdAt"),
			Query.equal('eventID', deleteID)
		]);
		items = getItems.documents;


	};

	return (
		<AlertDialog open={open} onOpen={onOpen}>
			<AlertDialogContent className="max-w-[90%]">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Event?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
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
					{/* <AlertDialogAction onClick={() => MakeToast()}>
						Yes, Delete
					</AlertDialogAction> */}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
