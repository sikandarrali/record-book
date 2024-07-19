"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Notfound() {
    return (
        <div className={'flex flex-col items-center w-full pt-10 gap-5'}>
            <UIText>Page Not Found</UIText>
            <Link href={'/events'}>
                <Button>Back Home</Button>
            </Link>
        </div>
    )
}
