"use client"
import * as React from 'react';
import {useNetworkStatus} from "@/lib/hooks/useNetworkStatus";
import {useState} from "react";
import {WifiOff} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion"

export const NetworkStatusIndicator = () => {
    const isOnline = useNetworkStatus();
    const firstUpdate = React.useRef(true);

    const [show, setShow] = useState(false)

    React.useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        isOnline
            ? setShow(false)
            : setShow(true)
    }, [show, isOnline]);

    return (
        <>
            {show &&
                <div className={'fixed inset-0 bg-black/70 z-[10000] flex flex-col justify-end'}>
                    <div className={'bg-white flex flex-col gap-2 justify-center items-center py-20'}>
                        <WifiOff className={'text-primary w-8 h-8'}/>
                        <h2 className={'text-primary font-semibold text-lg'}>No Internet Connection</h2>
                        <p className={'text-sm'}>Please check your connection.</p>
                    </div>
                </div>
            }
        </>
    );
};