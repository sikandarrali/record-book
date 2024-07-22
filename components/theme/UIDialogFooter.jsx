import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const UIDialogFooter = ({onDelete, onOpenChange, actionLabel, cancelLabel}) =>{
    const t = useScopedI18n('general')
    return(
        <AlertDialogFooter className={'!flex-row items-center !justify-between gap-4'} dir={'ltr'}>
            <AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
                <UIText variant={'button'} text={actionLabel || t('btn.yesDelete')}/>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
                <UIText variant={'button'} text={cancelLabel || t('btn.cancel')}/>
            </AlertDialogAction>
        </AlertDialogFooter>
    )
}