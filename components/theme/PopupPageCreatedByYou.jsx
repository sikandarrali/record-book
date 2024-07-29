import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {LockKeyhole} from "lucide-react";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";

export const PopupPageCreatedByYou = ({className, side, align}) =>{
    const t = useI18n()

    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                    <LockKeyhole className={'w-5 h-5'}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={className} side={side} align={align} >
                <UIText text={t('pages.records.badgeCreatedByYou')} />
            </PopoverContent>
        </Popover>
    )
}