"use client"
import {Badge} from "@/components/ui/badge";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";

export const BookType = ({type}) =>{
    const t = useI18n()

    return(
        <div className={'flex justify-center flex-1'}>
            {type === "khaataBook" &&
                <Badge variant={'secondary'} className={'px-2 py-1.5'}>
                    <UIText text={t('labels.khaataBook')} variant={'xs'}/>
                </Badge>
            }
            {type === "recordBook" &&
                <Badge variant={'secondary'} className={'px-2 py-1.5'}>
                    <UIText text={t('labels.recordBook')} variant={'xs'}/>
                </Badge>
            }
        </div>
    )
}