import { useEffect, useState } from 'react';

const useIsIOS = () => {
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iosDevices = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(iosDevices);
    }, []);

    return isIOS;
};

export default useIsIOS;
