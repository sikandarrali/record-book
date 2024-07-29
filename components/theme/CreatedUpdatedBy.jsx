import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";

export const CreatedUpdatedBy = ({createdDate, updatedDate, data}) =>{
    const t = useI18n()
    return(
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className={'border-0 w-full'}>
                <AccordionTrigger className={' hover:no-underline pt-4 justify-start gap-4'}>
                    <UIText text={t('labels.viewCreatedEditedBy')}/>
                </AccordionTrigger>

                <AccordionContent className={'divide-y divide-muted'}>
                    <div className={'flex py-4'}>
                        <div className={'w-1/4 flex flex-col shrink-0'}>
                            <UIText weight={'medium'} variant={'sm'} text={t('labels.createdBy')}/>
                        </div>
                        <div className={'w-3/4 flex flex-col pl-4'}>
                            <UIText variant={'sm'} weight={'semibold'} className={'!text-left'} text={data?.createdBy[0] || '-'} textOrientation={'left'}/>
                            <UIText variant={'xs'} text={data?.createdBy[1] || '-'} textOrientation={'left'}/>
                            <p className={'flex flex-wrap rtl:justify-end items-center gap-2 mt-2 '}>
                                <UIText variant={'xs'} weight={'medium'} className={'order-1 rtl:order-2'} text={t('labels.onDay')}/>
                                <UIText variant={'xs'} weight={'medium'} className={'order-2 rtl:order-1'} text={`${createdDate.day} ${t(`months.${createdDate.month.toLowerCase()}`)+t('months.comma')} ${createdDate.year}`}/>
                                <UIText variant={'xs'} weight={'medium'} className={'order-3 rtl:order-3'} text={t('labels.atTime')}/>
                                <UIText variant={'xs'} weight={'medium'} className={'order-4 rtl:order-4 rtl:mt-2'} text={`${createdDate.hours}:${createdDate.minutes}:${createdDate.minutes}`}/>
                            </p>
                        </div>
                    </div>
                    {data?.updatedBy[0] &&
                        <div className={'flex py-4'}>
                            <div className={'w-1/4 flex flex-col shrink-0'}>
                                <UIText weight={'medium'} variant={'sm'} text={t('labels.updatedBy')}/>
                            </div>
                            <div className={'w-3/4 flex flex-col pl-4'}>
                                <UIText variant={'sm'} weight={'semibold'} text={data?.updatedBy[0] || '-'} textOrientation={'left'}/>
                                <UIText variant={'xs'} text={data?.updatedBy[1] || '-'} textOrientation={'left'}/>
                                <p className={'flex flex-wrap rtl:justify-end items-center gap-2 mt-2 '}>
                                    <UIText variant={'xs'} weight={'medium'} className={'order-1 rtl:order-2'} text={t('labels.onDay')}/>
                                    <UIText variant={'xs'} weight={'medium'} className={'order-2 rtl:order-1'} text={`${updatedDate.day} ${t(`months.${updatedDate.month.toLowerCase()}`)+t('months.comma')} ${updatedDate.year}`}/>
                                    <UIText variant={'xs'} weight={'medium'} className={'order-3 rtl:order-3'} text={t('labels.atTime')}/>
                                    <UIText variant={'xs'} weight={'medium'} className={'order-4 rtl:order-4 rtl:mt-2'} text={`${updatedDate.hours}:${updatedDate.minutes}:${updatedDate.minutes}`}/>
                                </p>
                            </div>
                        </div>
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}