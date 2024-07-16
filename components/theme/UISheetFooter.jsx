import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const UISheetFooter = ({disabled, adding, onOpenChange, labelAction, labelCancel }) =>{
    const t = useScopedI18n('general')
    return(
        <div className={'flex flex-col w-full gap-2.5'}>
            <Button
                size="2xl"
                stretched
                disabled={disabled}
                type="submit"
            >
                {adding ? (
                    <>
                        <Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
                    </>
                ) : <UIText>{labelAction || t('btn.saveChanges')}</UIText>
                }
            </Button>
            <Button
                size="2xl"
                stretched
                disabled={disabled}
                variant={'outline'}
                type={'button'}
                onClick={()=> onOpenChange(false)}
            >
               <UIText>{labelCancel || t('btn.cancel')}</UIText>
            </Button>
        </div>
    )
}