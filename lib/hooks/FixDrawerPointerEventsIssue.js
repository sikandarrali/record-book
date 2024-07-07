export const FixDrawerPointerEventsIssue = (state) =>{
    if (state) {
        // Pushing the change to the end of the call stack
        const timer = setTimeout(() => {
            document.body.style.pointerEvents = "";
        }, 0);
        return () => clearTimeout(timer);
    } else {
        document.body.style.pointerEvents = "auto";
    }
}