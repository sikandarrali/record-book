import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent, DialogDescription,
	DialogFooter,
	DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Info, Pen, Trash2, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { DeleteEvent } from "./DeleteEvent";
import { EditEvent } from "./EditEvent";

const EventInfo = ({ eventData, sum }) => {
	const [openDetails, setOpenDetails] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const router = useRouter();

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
						<div className="flex gap-4 text-center justify-center">
							<Text
								variant={"h2"}
								className="text-primary text-center self-center"
							>
								{eventData?.name}
							</Text>
						</div>

						<div className={'hidden'}><DialogTitle/></div>
					</DialogHeader>

					<div className={'hidden'}><DialogDescription/></div>

					<Table className="mt-6">
						<TableBody className="font-medium text-base">
							<TableRow>
								<TableCell>Total</TableCell>
								<TableCell className="text-right text-primary font-semibold text-xl">
									<NumericFormat
										allowNegative={false}
										value={Number(sum)}
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
									{eventData?.date}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Venue</TableCell>
								<TableCell className="text-right">
									{eventData?.venue}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<DialogFooter className={"mt-10 justify-center"}>
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

			<EditEvent open={openEdit} onOpen={setOpenEdit} eventData={eventData} />
			<DeleteEvent
				open={openDelete}
				onOpen={setOpenDelete}
				deleteID={eventData?.$id}
			/>
		</>
	);
};

export default EventInfo;
