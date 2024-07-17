// hooks/usePWAStatus.js

import { useEffect, useState } from 'react';

const usePWAStatus = () => {
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check using standalone property
        if (window.navigator.standalone) {
            setIsInstalled(true);
        } else if (window.matchMedia('(display-mode: standalone)').matches) {
            // Check using display-mode media query
            setIsInstalled(true);
        } else {
            setIsInstalled(false);
        }
    }, []);

    return isInstalled;
};

export default usePWAStatus;
