"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";

export default function Home() {

    return (
        <PageContainer hideTopbar>

            <UIText variant="heading" className={'text-primary'} text={'Test Page'}/>

        </PageContainer>
    );
}
