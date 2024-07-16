import Link from 'next/link'
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText"
import {Button} from "@/components/ui/button";
import {HomeIcon} from "lucide-react";
import {useScopedI18n} from "@/locales/client";

export default function NotFound() {

    const t = useScopedI18n('pageNotFound')

    return (
        <PageContainer className={'flex flex-1'}>
            <div className={'flex flex-col flex-1 justify-center items-center gap-10'}>
                <UIText variant={'h2'}>{t('text')}</UIText>
                <Link href={"/events"}><Button className={'font-semibold'}> <HomeIcon className={'w-4 h-4 mr-1.5'}/> Return Home</Button></Link>
            </div>
        </PageContainer>
    )
}