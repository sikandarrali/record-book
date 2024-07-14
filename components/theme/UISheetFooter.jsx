import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {useTranslations} from "next-intl";

export const UISheetFooter = ({disabled, adding, onOpenChange, labelAction, labelCancel }) =>{
    const t = useTranslations('general.btn')
    return(
        <div className={'flex flex-col w-full gap-2.5'}>
            <Button
                className="w-full"
                size="2xl"
                stretched
                disabled={disabled}
                type="submit"
            >
                {adding ? (
                    <>
                        <Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
                    </>
                ) : labelAction || t('saveChanges')
                }
            </Button>
            <Button
                className="w-full"
                size="2xl"
                stretched
                disabled={disabled}
                variant={'outline'}
                type={'button'}
                onClick={()=> onOpenChange(false)}
            >
                {labelCancel || t('cancel')}
            </Button>
        </div>
    )
}