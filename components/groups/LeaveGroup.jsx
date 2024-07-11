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
import {TriangleAlert} from "lucide-react";
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";

export const LeaveGroup = ({ open, onOpenChange, groupName, onLeave }) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
                <AlertDialogHeader className={'!text-left'}>
                    <AlertDialogTitle className={'text-primary flex items-center justify-center gap-2'}>
                        <TriangleAlert className={'w-5 h-5'}/>
                        <span>Leave Group</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className={"flex flex-col text-center text-base items-center gap-1 !my-5"}>
                        <span>{`You're about to leave:`}</span>
                        <span className={'font-semibold text-primary'}>{groupName}</span>
                        <span>You will no longer be able to access Events & other data shared with this group.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <UIDialogFooter yesLabel={'Yes, Leave'} onDelete={onLeave} onOpenChange={onOpenChange}/>
            </AlertDialogContent>
        </AlertDialog>
    );
};
