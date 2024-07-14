import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";
import {useTranslations} from "next-intl";

export const UIDialogFooter = ({onDelete, onOpenChange, actionLabel, cancelLabel}) =>{
    const t = useTranslations('general.btn')
    return(
        <AlertDialogFooter className={'!flex-row items-center !justify-between gap-4'}>
            <AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
                {actionLabel || t('yesDelete')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
                {cancelLabel || t('cancel')}
            </AlertDialogAction>
        </AlertDialogFooter>
    )
}