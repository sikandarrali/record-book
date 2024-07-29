import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Users2} from "lucide-react";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";
import {useData} from "@/components/contexts/DataContext";

export const PopupPageSharedWithGroup = ({teamId, className, side, align}) =>{
    const t = useI18n()
    const {userGroups} = useData()

    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                    <Users2 className={'w-5 h-5'}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={className} side={side} align={align}>
                <UIText text={t('pages.records.badgeSharedWithGroup', {groupName: <UIText weight={'semibold'} className={'text-primary px-1'} text={userGroups?.find((grp)=> grp.$id===teamId)?.name}/>})} />
            </PopoverContent>
        </Popover>
    )
}