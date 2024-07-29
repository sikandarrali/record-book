import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {useI18n, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export const UISheetFooterInForm = ({disabled, adding, onOpenChange, labelAction, labelCancel}) =>{
    const t = useI18n()
    return(
        <div className={'flex flex-col w-full gap-2.5'}>
            <Button
                size="2xl"
                disabled={disabled}
                type="submit"
            >
                {adding ? (
                    <>
                        <Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
                    </>
                ) : <UIText variant={'button'} text={labelAction || t('buttons.saveChanges')}/>
                }
            </Button>
            <Button
                size="2xl"
                disabled={disabled}
                variant={'outline'}
                type={'button'}
                onClick={()=> onOpenChange(false)}
            >
               <UIText variant={'button'} text={labelCancel || t('buttons.cancel')}/>
            </Button>
        </div>
    )
}