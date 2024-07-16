import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const UIDialogFooter = ({onDelete, onOpenChange, actionLabel, cancelLabel}) =>{
    const t = useScopedI18n('general')
    return(
        <AlertDialogFooter className={'!flex-row items-center !justify-between gap-4'}>
            <AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
                <UIText variant={'button'}>{actionLabel || t('btn.yesDelete')}</UIText>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
                <UIText variant={'button'}>{cancelLabel || t('btn.cancel')}</UIText>
            </AlertDialogAction>
        </AlertDialogFooter>
    )
}