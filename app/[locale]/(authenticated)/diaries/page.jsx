"use client";
import { AddPage } from "@/components/page/AddPage";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {FixStickyHeaderScrollError} from "@/lib/utils";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {client, COLLECTION_ID_BOOKS, COLLECTION_ID_DIARIES, DATABASE_ID, teams} from "@/components/appwrite/appwrite";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {useI18n, useScopedI18n} from "@/locales/client";
import {useRouter} from "next/navigation";
import {useAuth} from "@/components/contexts/AuthContext";
import Link from "next/link";
import {LockKeyhole, Users2} from "lucide-react";
import {LOCALE_PUBLIC_ROUTES} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import ScrollToTopButton from "@/components/page/ScrollToTopButton";
import Loader from "@/components/loaders/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useData} from "@/components/contexts/DataContext";
import AddDiary from "@/components/diary/AddDiary";

export default function Page() {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [localLoading, setLocalLoading] = useState(true)
    const scrollRef = useRef(null);
    const [refreshItems, setRefreshItems] = useState(false)
    const [diaries, setDiaries] = useState([])
    const {userOwnedGroups} = useData()
    const t = useI18n();
    const {user} = useAuth()

    const getDiaries = async () =>{
        try {
            const response = await db.diaries.list([
                Query.orderDesc("$createdAt"),
                Query.limit(1000)
            ]);

            setDiaries(response.documents)
        } catch (error) {
            // console.error("Error fetching event items:", error);
        }
        finally {
            setLocalLoading(false)
        }
    }

    useEffect(() => {
        getDiaries();
    }, []);

    // re-populate events when created, fixes missing $id issue
    useEffect(() => {
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_DIARIES}.documents`, (response) => {
            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                setDiaries(prev=> [response.payload, ...prev])
            }
            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                setDiaries(prev=> prev.filter(item=> item.$id !== response.payload.$id))
            }
            if (response.events.includes("databases.*.collections.*.documents.*.update")) {
                setDiaries(prev => {
                    // Find the index of the item to update
                    const index = prev.findIndex(item => item.$id === response.payload.$id);
                    if (index !== -1) {
                        // Create a new array with the updated item
                        const updatedItems = [...prev];
                        updatedItems[index] = response.payload; // Assuming response.payload contains the updated document data
                        return updatedItems;
                    }
                    return prev;
                });
            }
        });

        return ()=> unsubscribe()
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            FixStickyHeaderScrollError(scrollRef.current);
        }
    }, []);


    return (
        <PageContainer title={t('pages.diaries.titleDiaries')}>
            {localLoading ?
                <Loader/>
                :
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { duration: 0.3, delay: 0.4 },
                    }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4 -mx-4 px-4 mt-6 pb-20"
                    ref={scrollRef}
                >
                    {/* Book List */}
                    {diaries.length === 0 ?
                        <div className={'p-4 text-center mt-4 text-destructive'}>
                            <UIText text={t('pages.diaries.noDiaries')} weight={'semibold'}/>
                        </div>
                        :
                        diaries.map((diary, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: 0.3 + i / 10 },
                                }}
                                key={diary.$id}
                            >
                                <Link
                                    href={`/diary/${diary.$id}`}
                                    className={'relative p-8 hover:bg-muted border cursor-pointer flex items-center justify-center shadow-sm rounded-lg text-center outline-none'}
                                >
                                    <UIText variant={'heading'} className={'break-all text-primary'} text={diary?.name} textOrientation={'center'} />
                                    {diary.$permissions.some(permission => permission === `delete("user:${user.$id}")`) && <LockKeyhole className={'absolute left-2 top-2 w-5 h-5 text-primary'}/>}
                                    {diary.teamId && <Users2 className={'absolute right-2 top-2 w-5 h-5 text-primary'}/>}
                                </Link>
                            </motion.div>
                        ))
                    }
                </motion.div>
            }

            {/* Add New Button */}
            <div className={'fixed bottom-10 position-center-horizontally max-w-lg z-20 flex items-center justify-center px-6 left-0 w-full'}>
                <Button
                    onClick={() => setOpenAddModal(!openAddModal)}
                    className="flex flex-1 min-h-14"
                >
                    <UIText variant={'heading'} text={t('pages.diaries.addNew')}/>
                </Button>
            </div>

            <AddDiary
                open={openAddModal}
                onOpenChange={setOpenAddModal}
                refreshItems={refreshItems}
                setRefreshItems={setRefreshItems}
                userOwnedGroups={userOwnedGroups}
            />

            {/* Scroll to Top Button */}
            <ScrollToTopButton/>

        </PageContainer>
    );
}
