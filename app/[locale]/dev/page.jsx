"use client"
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {GetCurrentLanguage} from "@/lib/utils";
import {useI18n} from "@/locales/client";

export const Page = () => {

    const t = useI18n()

    return(
        <PageContainer>
            <UIText variant="heading" className={'text-primary mb-8'} text={t('title')}/>

            <div className={'flex flex-col gap-6'}>
                {/* Profile */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 border-b gap-2'}>
                    <UIText text={t('profile.title')} weight={'semibold'} className={'text-primary'}/>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText text={"Sikandar Ali"} weight={'medium'}/>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className={'border rtl:mt-3'}

                        >
                            <Pencil className={'w-5 h-5'}/>
                        </Button>
                    </div>
                </div>

                {/* Language */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 border-b gap-2'}>
                    <UIText text={t('language.title')} weight={'semibold'} className={'text-primary'}/>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText text={"ur"} weight={'medium'}/>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className={'border rtl:mt-3'}
                        >
                            <Pencil className={'w-5 h-5'}/>
                        </Button>
                    </div>
                </div>

                {/* Font Size */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 gap-2'}>
                    <UIText text={t('fontSize.title')} weight={'semibold'} className={'text-primary'}/>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText text={"base"} weight={'medium'}/>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className={'border rtl:mt-3'}
                            // onClick={()=> setOpenEditFontSize(true)}
                        >
                            <Pencil className={'w-5 h-5'}/>
                        </Button>
                    </div>
                </div>


                <div className={'-mx-6 px-6 pb-6 gap-2 text-center mt-10 text-sm text-muted-foreground'}>
                    App Version <span className={'font-semibold'}>3.3</span>
                </div>
            </div>
        </PageContainer>
    )
}

export default  Page