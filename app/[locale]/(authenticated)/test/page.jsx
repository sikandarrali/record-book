"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Page() {

    return (
        <PageContainer>

            <div className={'flex flex-col gap-4'}>

                base
                <div className={'flex flex-col gap-10 bg-blue-50 -mx-6 p-6'}>
                    <div className={'flex flex-col'} dir={"ltr"}>
                        <UIText variant={'heading'} text={'Groups'}/>
                        <UIText text={'Groups are a way of sharing your Events Data with others'}/>
                    </div>
                    <div className={'flex flex-col gap5'} dir={"rtl"}>
                        <UIText variant={'heading'} text={'گروپس'}/>
                        <UIText text={' گروپس کی مدد سے آپ ایونٹس ڈیٹا کو دوسروں کے ساتھ شیئر کرسکتے ہیں۔ گروپس کی مدد سے آپ ایونٹس ڈیٹا کو دوسروں کے ساتھ شیئر کرسکتے ہیں۔'}/>
                        <UIText variant={'sm'} text={' گروپس کی مدد سے آپ ایونٹس ڈیٹا کو دوسروں کے ساتھ شیئر کرسکتے ہیں۔ گروپس کی مدد سے آپ ایونٹس ڈیٹا کو دوسروں کے ساتھ شیئر کرسکتے ہیں۔'}/>
                    </div>

                    <div className={'flex items-center justify-between gap-4'} dir={"rtl"}>
                        <div className={'flex flex-col gap-1'}>
                            <UIText variant={'label'} text={'یہ لیبل ہے'}/>
                            <Input />
                        </div>
                        <div className={'flex flex-col gap-1'} dir={'ltr'}>
                            <UIText variant={'label'} text={'This is Label'}/>
                            <Input />
                        </div>
                    </div>
                    <div className={'flex items-center justify-between'}>
                        <Button><UIText variant={'button'} text={'ترامیم محفوظ کریں'} dir={"rtl"}/></Button>
                        <Button><UIText variant={'button'} text={'Save Changes'} dir={"rtl"}/></Button>
                    </div>
                </div>

            </div>

        </PageContainer>
    );
}
