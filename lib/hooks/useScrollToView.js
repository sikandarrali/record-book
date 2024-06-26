import { useEffect } from 'react';

const useScrollToView = () => {
    useEffect(() => {
        const handleFocus = (e) => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
            });
        };
    }, []);
};

export default useScrollToView;
