import Text from "@/components/theme/Text";
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
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Info, Pen, Trash2, X, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

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

const EventInfo = () => {
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	return (
		<>
			<div className="font-semibold" onClick={() => setOpenDetails(true)}>
				<Info className="cursor-pointer hover:scale-125 duration-300 text-background" />
			</div>

			<Dialog open={openDetails} onOpen={setOpenDetails}>
				<DialogContent className={"w-[90%] rounded-xl pt-0"} hideClose>
					<DialogHeader>
						<div
							className={
								"flex flex-row justify-between mt-4 border-b mb-4 py-4 pt-1"
							}
						>
							<Button
								type="submit"
								variant="outline"
								size="icon"
								onClick={() => setOpenDelete(true)}
							>
								<Trash2 className="h-5 w-5 text-primary" />
							</Button>
							<Button
								type="submit"
								variant="outline"
								size="icon"
								onClick={() => setOpenEdit(true)}
							>
								<Pen className="h-4 w-4" />
							</Button>
						</div>
						<DialogTitle className="flex justify-between gap-4 text-center">
							<Text variant={"h2"} className="text-primary">
								Sikandar Ki MehndiSikandar Ki MehndiSikandar Ki
								MehndiSikandar Ki MehndiSikandar Ki
								MehndiSikandar Ki Mehndi -{" "}
								{openDetails.toString()}
							</Text>
						</DialogTitle>
					</DialogHeader>

					<Table className="mt-6">
						<TableBody className="font-medium text-base">
							<TableRow>
								<TableCell>Total Amount</TableCell>
								<TableCell className="text-right text-primary font-semibold text-2xl">
									<NumericFormat
										allowNegative={false}
										value={Number(3000)}
										thousandSeparator={","}
										decimalSeparator={"."}
										displayType="text"
										decimalScale={2}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell className="text-right">
									28.03.2023
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Vanue</TableCell>
								<TableCell className="text-right">
									Bandhan Marriage Hall
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<DialogFooter className={"mt-10"}>
						<Button
							type="submit"
							variant="outline"
							size="icon"
							// stretched
							className="w-14 h-14 rounded-full self-center"
							onClick={() => setOpenDetails(false)}
						>
							<XIcon className="text-primary" />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Edit open={openEdit} onOpen={setOpenEdit} />
			<Delete open={openDelete} onOpen={setOpenDelete} />
		</>
	);
};

export default EventInfo;

const Edit = ({ open, onOpen }) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	return (
		<Sheet open={open} onOpen={onOpen} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
			>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Edit Event
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={() => onOpen(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Event Name
							</label>
							<Input type="text" />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Event Date
							</label>
							<Input type="text" />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Event Venue
							</label>
							<Input type="text" />
						</div>
						<div className="w-full flex flex-col gap-1">
							<label className="text-sm font-medium">
								Details (if any)
							</label>
							<Textarea />
						</div>
					</div>

					{/* Buttons */}
					<div className="flex items-center justify-between space-x-3">
						<Button
							onClick={() => onOpen(false)}
							size="2xl"
							stretched
						>
							Save Entry
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const Delete = ({ open, onOpen, deleteID }) => {
	const router = useRouter();
	const onDelete = (second) => {
		onOpen(false);

		router.replace("/");
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
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => onDelete(deleteID)}>
						Yes, Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
