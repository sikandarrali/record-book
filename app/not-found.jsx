import Link from 'next/link'
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text"
import {Button} from "@/components/ui/button";
import {HomeIcon} from "lucide-react";
import {useTranslations} from "next-intl";

export default function NotFound() {

    const t = useTranslations('pageNotFound')

    return (
        <PageContainer className={'flex flex-1'}>
            <div className={'flex flex-col flex-1 justify-center items-center gap-10'}>
                <Text variant={'h2'}>{t('text')}</Text>
                <Link href={"/events"}><Button className={'font-semibold'}> <HomeIcon className={'w-4 h-4 mr-1.5'}/> Return Home</Button></Link>
            </div>
        </PageContainer>
    )
}