import * as React from 'react';

const getOnLineStatus = () =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

export const useNetworkStatus = () => {
    const [status, setStatus] = React.useState(getOnLineStatus());
    const [hasInternetAccess, setHasInternetAccess] = React.useState(status);

    const checkInternetAccess = async () => {
        if (status) {
            try {
                await fetch('https://www.google.com/', {
                    mode: 'no-cors',
                });
                setHasInternetAccess(true);
            } catch (error) {
                setHasInternetAccess(false);
            }
        } else {
            setHasInternetAccess(false);
        }
    };

    const setOnline = () => {
        setStatus(true);
        checkInternetAccess();
    };

    const setOffline = () => {
        setStatus(false);
        setHasInternetAccess(false);
    };

    React.useEffect(() => {
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        // Initial check
        checkInternetAccess();

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, [status]);

    return hasInternetAccess;
};
