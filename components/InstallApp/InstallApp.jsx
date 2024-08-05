"use client"
import { useEffect, useState } from 'react';
import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {useI18n, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const t = useI18n()

    useEffect(() => {
        const handler = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    // console.log('User accepted the install prompt');
                } else {
                    // console.log('User dismissed the install prompt');
                }
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <Button onClick={handleInstallClick} className={'flex items-center gap-2'}>
            <Download className={'w-4 h-4'} />
            <UIText variant={'xs'} weight={'semibold'} className={'rtl:-mt-1.5'} text={t('buttons.installApp')} />
        </Button>
    );
};

export default InstallApp;
