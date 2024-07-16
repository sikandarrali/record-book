import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";
import {useScopedI18n} from "@/locales/client";

export const UIDialogFooter = ({onDelete, onOpenChange, actionLabel, cancelLabel}) =>{
    const t = useScopedI18n('general')
    return(
        <AlertDialogFooter className={'!flex-row items-center !justify-between gap-4'}>
            <AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
                {actionLabel || t('btn.yesDelete')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
                {cancelLabel || t('btn.cancel')}
            </AlertDialogAction>
        </AlertDialogFooter>
    )
}