import Link from "next/link";

export const Logo = () =>{
    return(
        <Link href={'/'} className={'flex gap-1 self-start -mt-1 cursor-pointer select-none'} dir={'ltr'}>
            <p className={'pt-5 text-base font-mono font-medium tracking-tighter text-muted-foreground'}>book</p>
            <p className={'font-urdu-heading text-4xl text-primary flex items-center gap-1'}>
                <span>یکارڈ</span>
                <span>ر</span>
            </p>
        </Link>
    )
}