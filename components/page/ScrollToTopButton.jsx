import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {ArrowUpCircle} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

const ScrollToTopButton = () =>{

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
            setVisible(true)
        }
        else if (scrolled <= 300){
            setVisible(false)
        }
    };

    const scrollToTop = () =>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };
    window.addEventListener('scroll', toggleVisible);

    return (
       <AnimatePresence>
           {visible &&
               <motion.div
                   initial={{opacity: 0, x: 100}}
                   animate={{opacity: 1, x: 0, transition:{duration: 0.5}}}
                   exit={{opacity: 0, x: 100, transition:{duration: 0.5}}}
                   className={'fixed bottom-20 right-10'}
                   onClick={scrollToTop}
               >
                   <Button variant={'secondary'} className={'rounded-full h-12 w-12 p-2 hover:bg-muted-foreground/30'}>
                       <ArrowUpCircle className={'w-6 h-6'}/>
                   </Button>
               </motion.div>
           }
       </AnimatePresence>
    );
}

export default ScrollToTopButton;