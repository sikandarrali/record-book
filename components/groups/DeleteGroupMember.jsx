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
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";
import {TriangleAlert} from "lucide-react";

export const DeleteGroupMember = ({ open, onOpenChange, userEmail, onDelete, groupName }) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>

			<AlertDialog open={open} onOpenChange={onOpenChange}>
				<AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
					<AlertDialogHeader className={'!text-left'}>
						<AlertDialogTitle className={'text-primary flex items-center justify-center gap-2'}>
							<TriangleAlert className={'w-5 h-5'}/>
							<span>Remove User</span>
						</AlertDialogTitle>
						<AlertDialogDescription className={"flex flex-col text-base text-center items-center gap-1 !my-5"}>
							<span>Do you really want to remove</span>
							<span className={'font-semibold text-primary'}>{userEmail}</span>
							<span>from <span className={'font-semibold'}>{groupName}</span> Group.</span>
							<span className={'mt-4 font-semibold'}>They will not be able to access Events Data anymore.</span>
						</AlertDialogDescription>
					</AlertDialogHeader>

					<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>
				</AlertDialogContent>
			</AlertDialog>


			{/*<AlertDialogContent className={"w-[90%] rounded-xl"}>*/}
			{/*	<AlertDialogHeader>*/}
			{/*		<AlertDialogTitle className={'text-primary'}>Remove User</AlertDialogTitle>*/}
			{/*		<AlertDialogDescription className={"mt-2 flex flex-col gap-1"}>*/}
			{/*			<span>Do you really want to remove </span>*/}
			{/*			<span className={'font-semibold'}>{userEmail}</span>*/}
			{/*			<span>from Group.</span>*/}
			{/*			<span className={'text-primary'}>They will not be able to access Events Data anymore.</span>*/}
			{/*		</AlertDialogDescription>*/}
			{/*	</AlertDialogHeader>*/}

			{/*	<UIDialogFooter onDelete={onDelete} onOpenChange={onOpenChange}/>*/}
			{/*</AlertDialogContent>*/}
		</AlertDialog>
	);
};
