"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp, Info, ShieldCheck, Users2} from "lucide-react";
import {AddGroup} from "@/components/groups/AddGroup";
import SingleGroup from "@/components/groups/SingleGroup";
import {teams} from "@/components/appwrite/appwrite";
import {useScopedI18n} from "@/locales/client";
import {useData} from "@/components/contexts/DataContext";

export default function Page() {

    const [openAddGroup, setOpenAddGroup] = useState(false)
    const [showInformation, setShowInformation] = useState(false)
    const t = useScopedI18n('groups')
    const {userGroups} = useData()
    const [localLoading, setLocalLoading] = useState(true)

    return (
        <PageContainer hideTopbar>
            <UIText variant="heading" className={'text-primary'} text={t('title')}/>
            <UIText text={t('text')}/>

            <div className={'border border-border py-4 px-6 rounded-lg mt-6 cursor-pointer'} onClick={()=> setShowInformation(!showInformation)} >
                <div className={'flex items-center justify-between gap-2 font-medium text-primary'}>
                    <div className={'flex items-center gap-2'}>
                        <Info className={'w-4 h-4 rtl:mt-2'}/>
                        <UIText text={t('information')}/>
                    </div>
                    {showInformation ? <ChevronUp className={'w-5 h-5 ltr:mt-1 stroke-[3]'} /> : <ChevronDown  className={'w-5 h-5 ltr:mt-1 stroke-[3]'} />}
                </div>
                {showInformation &&
                    <ul className={'list-disc pl-6 gap-2 mt-2 flex flex-col rtl:text-right'}>
                        <li><UIText variant={'sm'} text={t('informationP1')}/></li>
                        <li><UIText variant={'sm'} text={t('informationP2')}/></li>
                        <li><UIText variant={'sm'} text={t('informationP3')}/></li>
                    </ul>
                }
            </div>

            <UIText variant={'lg'} className={'py-2 mt-4 text-primary'} weight={'medium'} text={t('labelYourGroups')}/>

            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0,
                    transition: { delay: 0.2 }
                }}
                className={'flex flex-col border border-border rounded-lg relative shadow overflow-hidden'}
            >
                {userGroups.length === 0 ?
                    <UIText text={t('noGroups')} className={'p-4'}/>
                    : userGroups.map((data, i)=>(
                        <motion.div
                            key={data.$id}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0,
                                transition: { delay: 0.3 + i / 10 }
                            }}
                            className={'w-full border-b border-border hover:bg-muted last-of-type:border-b-0 cursor-pointer'}
                        >
                            <SingleGroup data={data} />
                        </motion.div>
                    ))
                }

            </motion.div>

            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0,
                    transition: { delay: 0.2 }
                }}
            >
                <Button
                    stretched
                    size="2xl"
                    type={'submit'}
                    className={'mt-5'} onClick={()=> setOpenAddGroup(true)}
                >
                    <UIText variant={'button'} text={t('btnCreateNewGroup')}/>
                </Button>
            </motion.div>

            <AddGroup open={openAddGroup} onOpenChange={setOpenAddGroup} />
        </PageContainer>
    );
}
