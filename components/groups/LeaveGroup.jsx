"use client";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UIText from "@/components/theme/UIText";
import {TriangleAlert} from "lucide-react";
import {UIDialogFooter} from "@/components/theme/UIDialogFooter";
import {useScopedI18n} from "@/locales/client";

export const LeaveGroup = ({ open, onOpenChange, group, onLeave }) => {
    const t = useScopedI18n('groups')
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className={"w-[90%] rounded-xl overflow-auto"}>
                <AlertDialogHeader className={'!text-left'}>
                    <AlertDialogTitle className={'text-primary flex items-center justify-center gap-2'}>
                        <TriangleAlert className={'w-5 h-5'}/>
                        <span>{t('btnLeaveGroup')}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className={"flex flex-col text-center text-base items-center gap-1 !my-5"}>
                        <span>{t('leaveGroupText1')}</span>
                        <span className={'font-semibold text-primary'}>{group.name}</span>
                        <span>{t('leaveGroupText2')}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <UIDialogFooter actionLabel={t('btnYesLeave')} onDelete={()=> onLeave(group.$id)} onOpenChange={onOpenChange}/>
            </AlertDialogContent>
        </AlertDialog>
    );
};
