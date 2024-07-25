import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";
import {useI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const UIDialogFooter = ({onDelete, onOpenChange, actionLabel, cancelLabel}) =>{
    const t = useI18n()
    return(
        <AlertDialogFooter className={'!flex-row items-center !justify-between gap-4'} dir={'ltr'}>
            <AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
                <UIText variant={'button'} text={actionLabel || t('buttons.yesDelete')}/>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
                <UIText variant={'button'} text={cancelLabel || t('buttons.cancel')}/>
            </AlertDialogAction>
        </AlertDialogFooter>
    )
}