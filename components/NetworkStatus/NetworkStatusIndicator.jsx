"use client"
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import {useLayoutEffect, useRef, useState} from "react";
import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const NetworkStatusIndicator = () => {
    const hasInternetAccess = useNetworkStatus();
    const firstUpdate = useRef(true);
    const [show, setShow] = useState(false);

    // useLayoutEffect(() => {
    //     if (firstUpdate.current) {
    //         firstUpdate.current = false;
    //         return;
    //     }
    //     if (hasInternetAccess) {
    //         setShow(false);
    //         document.body.style.overflow = '';
    //     } else {
    //         setShow(true);
    //         document.body.style.overflow = 'hidden';
    //     }
    // }, [hasInternetAccess]);

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className={'fixed inset-0 bg-black/70 z-[10000] flex flex-col justify-end'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={'bg-white flex flex-col gap-2 justify-center items-center py-20'}>
                            <WifiOff className={'text-primary w-8 h-8'} />
                            <h2 className={'text-primary font-semibold text-lg'}>No Internet Connection</h2>
                            <p className={'text-sm'}>Please check your connection.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
