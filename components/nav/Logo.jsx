import Link from "next/link";
import {cn} from "@/lib/utils";

export const Logo = ({size}) =>{
    return(
        <Link
            href={'/'}
            className={cn(
                'flex gap-1 self-start -mt-1 cursor-pointer select-none',
                size === '2xl' && "scale-150"
            )}
            dir={'ltr'}
        >
            <p className={'pt-5 text-base font-mono font-medium tracking-tighter text-muted-foreground'}>book</p>
            <p className={'font-urdu-heading text-4xl text-primary flex items-center gap-1'}>
                <span>یکارڈ</span>
                <span>ر</span>
            </p>
        </Link>
    )
}