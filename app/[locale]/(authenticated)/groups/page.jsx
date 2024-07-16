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

export default function Page() {

    const [openAddGroup, setOpenAddGroup] = useState(false)
    const [userGroups, setUserGroups] = useState([])
    const [refresh, setRefresh] = useState([])
    const [showInformation, setShowInformation] = useState(false)
    const t = useScopedI18n('groups')

    const getUserGroups = async () =>{
        const tempGroups = await teams.list()
        setUserGroups(tempGroups.teams)
    }
    useEffect(() => {
        getUserGroups()
    }, [refresh]);

    return (
        <PageContainer hideTopbar>
            <UIText variant="heading" className={'mb-2 text-primary'}>{t('title')}</UIText>
            <UIText>{t('text')}</UIText>

            <div className={'bg-muted py-4 px-6 rounded-lg mt-2 cursor-pointer'} onClick={()=> setShowInformation(!showInformation)} >
                <UIText className={'flex items-center justify-between gap-2 font-medium text-primary'}>
                    <span className={'flex items-center gap-2'}><Info className={'w-4 h-4'}/> {t('information')}</span>
                    {showInformation ? <ChevronUp className={'w-5 h-5 ltr:mt-1 stroke-[3]'} /> : <ChevronDown  className={'w-5 h-5 ltr:mt-1 stroke-[3]'} />}
                </UIText>
                {showInformation &&
                    <ul className={'list-disc px-5 gap-2 mt-2 flex flex-col rtl:text-right'}>
                        <li><UIText variant={'sm'}>{t('informationP1')}</UIText></li>
                        <li><UIText variant={'sm'}>{t('informationP2')}</UIText></li>
                        <li><UIText variant={'sm'}>{t('informationP3')}</UIText></li>

                        {/*<li><UIText variant={'sm'} className={'flex flex-col gap-1'}>*/}
                        {/*    <span className={'flex gap-1 items-center'}><ShieldCheck className={'w-4 h-4 text-primary'}/> {`indicates Groups you've created`}</span>*/}
                        {/*    <span className={'flex gap-1 items-center'}><Users2 className={'w-4 h-4 text-primary'}/> {`indicates Groups you've joined`}</span>*/}
                        {/*</UIText></li>*/}
                    </ul>
                }
            </div>

            <UIText className={'py-2 mt-4 text-primary'}>{t('labelYourGroups')}</UIText>

            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0,
                    transition: { delay: 0.2 }
                }}
                className={'flex flex-col bg-muted rounded-lg relative shadow'}
            >
                {userGroups.length === 0 ?
                    <UIText className={'p-4 rtl:pb-1.5 text-center ltr:italic rtl:text-base'}>{t('noGroups')}</UIText>
                    : userGroups.map((data, i)=>(
                        <motion.div
                            key={data.$id}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0,
                                transition: { delay: 0.3 + i / 10 }
                            }}
                            className={'w-full border-b last-of-type:border-b-0'}
                        >
                            <SingleGroup data={data} userGroups={userGroups} setUserGroups={setUserGroups} />
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
                    <UIText variant={'button'}>{t('btnCreateNewGroup')}</UIText>
                </Button>
            </motion.div>

            <AddGroup open={openAddGroup} setRefresh={setRefresh} onOpenChange={setOpenAddGroup} setUserGroups={setUserGroups}/>
        </PageContainer>
    );
}
