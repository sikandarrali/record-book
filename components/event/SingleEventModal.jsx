"use client";
import { AddEventItem } from "@/components/event-items/AddEventItem";
import { SingleListItem } from "@/components/event-items/SingleListItem";
import EventInfo from "@/components/event/EventInfo";
import LoadingFallback from "@/components/loaders/LoadingFallback";
import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {Plus, Users2, XIcon} from "lucide-react";
import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import { NumericFormat } from "react-number-format";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {client} from "@/components/appwrite/appwrite";
import {useMediaQuery} from "react-responsive";
import {cn} from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import {SearchItems} from "@/components/event-items/SearchItems";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useAuth} from "@/components/contexts/AuthContext";
import {useScopedI18n} from "@/locales/client";
import {isStringUrdu} from "@/lib/isStringUrdu";
// import {toast} from "react-toastify";
// import {ToastOptions} from "@/lib/ToastOptions";

const SingleEventModal = ({ eventData }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
    const [isOpen, setIsOpen] = useState(false)
    const headerRef = useRef(null);
    const t = useScopedI18n('events');

    const [openAddModal, setOpenAddModal] = useState(false);
    const [totalSum, setTotalSum] = useState(0);

    const [items, setItems] = useState([])
    const [itemsDefault, setItemsDefault] = useState([])
    const {user} = useAuth()

    const itemsPerPage = 15;
    const [visibleItems, setVisibleItems] = useState([]); // Currently visible items
    const [hasMoreItems, setHasMoreItems] = useState(true); // Flag to check if more items are available
    const [loadingItems, setLoadingItems] = useState(false); // To show loadingItems spinner

    // useEffect(() => {
    //    if(isOpen){
    //        const newParams = new URLSearchParams(searchParams);
    //        newParams.set('id', eventData.$id);
    //        router.push(`?${newParams.toString()}`, { shallow: true });
    //    }
    // }, [isOpen]);
    //
    const onClose = () =>{
        setIsOpen(false)
        // const newParams = new URLSearchParams(searchParams);
        // newParams.delete('id');
        // router.push(`?${newParams.toString()}`, { shallow: true });
    }

    // get items
    useEffect(() => {
        const getEventItems = async () => {
            if(user){
                try {
                    const response = await db.eventItems.list([
                        Query.orderDesc("$createdAt"),
                        Query.equal('eventID', eventData.$id)
                    ]);
                    setItems(response.documents)
                    setItemsDefault(response.documents)
                } catch (error) {
                    // console.error("Error fetching event items:", error);
                }
            }
        }

        return ()=> getEventItems();
    }, [isOpen]);

    // appwrite realtime functionality
    useEffect(() => {
        const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID_EVENT_ITEMS}.documents`, (response) => {
            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                if(response.payload.eventID === eventData.$id){
                    setItems(prev=> [response.payload, ...prev])
                    setItemsDefault(prev=> [response.payload, ...prev])
                }
            }
            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                setItems(prev=> prev.filter(item=> item.$id !== response.payload.$id))
                setItemsDefault(prev=> prev.filter(item=> item.$id !== response.payload.$id))
            }
            if (response.events.includes("databases.*.collections.*.documents.*.update")) {
                setItems(prev => {
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
                setItemsDefault(prev => {
                    // Find the index of the item to update
                    const index = prev.findIndex(item => item.$id === response.payload.$id);
                    if (index !== -1) {
                        // Create a new array with the updated item
                        const updatedItemsDefault = [...prev];
                        updatedItemsDefault[index] = response.payload; // Assuming response.payload contains the updated document data
                        return updatedItemsDefault;
                    }
                    return prev;
                });
            }
        });

        return ()=> unsubscribe()
    }, []);

    useEffect(() => {
        setTotalSum(itemsDefault?.reduce((acc, item) => acc + item.amount, 0));
    }, [itemsDefault]);

    
    // Function to load more items
    const loadMorePosts = useCallback(() => {
        if (loadingItems) return; // If already loadingItems, don't load more

        setLoadingItems(true);
        setTimeout(() => {
            const currentLength = visibleItems.length;
            const morePosts = items.slice(currentLength, currentLength + itemsPerPage);

            setVisibleItems(prevVisiblePosts => [
                ...prevVisiblePosts,
                ...morePosts
            ]);

            if (currentLength + morePosts.length >= items.length) {
                setHasMoreItems(false);
            }

            setLoadingItems(false);
        }, 1000); // Simulate loadingItems time
    }, [visibleItems, items, loadingItems]);

    useEffect(() => {
        setItems(itemsDefault);
        setVisibleItems(itemsDefault.slice(0, itemsPerPage));
        setHasMoreItems(true)
        setLoadingItems(false)
    }, [itemsDefault]);


    // useEffect(() => {
    //
    //     let id = searchParams.get('id')
    //
    //     if (id === eventData.$id) {
    //         setIsOpen(true);
    //     }
    //
    // }, [searchParams]);
    // if (isOpen) return null;

    // const copyToClipboard = async () => {
    //     try {
    //         await navigator.clipboard.writeText(window.location.href);
    //         toast.info("Link copied", ToastOptions);
    //     } catch (err) {
    //         toast.error("Link not copied", ToastOptions);
    //     }
    // };

    return (
        <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}
            defaultOpen={false}
        >
            <SheetTrigger asChild>
                <UIText
                    variant={'heading'}
                    className={cn(
                        'flex flex-1 justify-center items-center px-6 md:px-8 pt-8 pb-7 relative',
                        isStringUrdu(eventData.name) && 'font-urdu')}
                >
                    {eventData?.name}
                    {eventData.teamId && <Users2 className={'absolute right-2 top-2 w-5 h-5'}/>}
                </UIText>
            </SheetTrigger>
            <SheetContent
                className={cn("!pt-0 flex flex-col justify-start !h-[100dvh] border-0")}
                side={isDesktop ? "right" : "bottom"}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>

                <div className={'relative flex flex-col flex-1'}>
                    <Suspense fallback={<LoadingFallback />}>
                        <div className="flex flex-col bg-primary text-background shadow-lg -mx-6 gap-4 z-10">
                            {/* header */}
                            <div className="flex justify-between items-center pt-4 pb-2 w-full z-20 border-b px-4 border-primary-foreground/40 relative" ref={headerRef}>
                                <div className={'flex items-center gap-4'}>
                                    <EventInfo
                                        eventData={eventData}
                                        sum={totalSum}
                                    />
                                </div>

                                <div className="flex items-center gap-2 rtl:flex-row-reverse relative select-none pointer-events-none">
                                    <span className="text-sm">Rs</span>
                                    <span className="font-bold text-xl">
                                    <NumericFormat
                                        allowNegative={false}
                                        value={totalSum}
                                        thousandSeparator={","}
                                        decimalSeparator={"."}
                                        displayType="text"
                                        decimalScale={2}
                                    />
                                </span>
                                </div>
                            </div>

                            <UIText
                                variant={"heading"}
                                className={cn(
                                    isStringUrdu(eventData.name) && 'font-urdu',
                                    "text-background px-6 text-center pb-4 pt-1 flex flex-col justify-center items-center gap-4 select-none"
                                )}
                            >
                                {eventData?.name}
                            </UIText>
                        </div>

                        <div className="flex flex-col pb-36 mt-5">
                            <SearchItems
                                visibleItems={visibleItems}
                                setVisibleItems={setVisibleItems}
                                itemsDefault={itemsDefault}
                                itemsPerPage={itemsPerPage}
                                openAddModal={openAddModal}
                            />

                            <UIText variant={'sm'} className={'py-1.5 font-medium bg-muted -mx-6 flex items-center justify-center px-6 gap-2 text-muted-foreground'}>
                                {t('totalEntries')} <span className={'text-primary font-semibold text-base'}>{items.length}</span>
                            </UIText>

                            <div className="flex flex-col -mx-6 overflow-y-auto">

                                {visibleItems.map((item, i) => (
                                    <motion.div key={item.$id}>
                                        <SingleListItem item={item} eventID={eventData.$id} />
                                    </motion.div>
                                ))}

                                {items.length > 0 &&
                                    <div className={'flex flex-col w-full justify-center items-center mt-8 !border-t-0'}>
                                        {!hasMoreItems && <div className="mt-4 font-medium italic text-muted-foreground text-center">{t('allItemsShown')}</div>}

                                        {loadingItems ? (
                                            <Button
                                                disabled={loadingItems}
                                                onClick={loadMorePosts}
                                                variant={'outline'}
                                                size={'lg'}
                                                className={'w-40'}
                                            >
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                {t('btnLoading')}
                                            </Button>
                                        ) :
                                            hasMoreItems && items.length > itemsPerPage &&
                                                <Button
                                                    onClick={loadMorePosts}
                                                    variant={'secondary'}
                                                    size={'lg'}
                                                    className={'w-40'}
                                                >
                                                    {t('btnLoadMore')}
                                                </Button>
                                        }
                                    </div>
                                }

                            </div>
                        </div>

                        <div className={'fixed lg:absolute bottom-14 inset-x-0 z-10 flex justify-center'}>
                            <div
                                className="w-[4.5rem] h-[4.5rem] shadow-lg flex items-center justify-center rounded-full bg-primary cursor-pointer"
                                onClick={() => {
                                    setOpenAddModal(true)
                                    if (headerRef.current) {
                                        headerRef.current.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                <Plus className="text-white w-10 h-10" />
                            </div>

                            <div
                                className="flex items-center cursor-pointer justify-center w-12 h-12 lg:hidden rounded-full absolute shadow-lg bg-muted-foreground right-0 mr-6 md:right-16 top-1/2 -translate-y-1/2"
                                onClick={()=> onClose()}
                            >
                                <XIcon className="text-muted" />
                            </div>
                        </div>

                        <AddEventItem
                            open={openAddModal}
                            onOpenChange={setOpenAddModal}
                            eventData={eventData}
                        />
                    </Suspense>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SingleEventModal;
