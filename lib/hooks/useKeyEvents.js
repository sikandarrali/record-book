import { useState, useEffect } from "react";

export const useKeyEvents = (key, callback) => {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === key) {
                e.preventDefault();
                setKeyPressed(true);
                callback();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [key, callback]);

    return keyPressed;
};