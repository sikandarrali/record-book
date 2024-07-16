"use client";

import UIText from "@/components/theme/UIText";
import PageContainer from "@/components/providers/PageContainer";

const Page = () => {

    return(
       <PageContainer>
           <div className={'flex flex-col p-6 gap-10 relative overflow-auto pb-20'}>


               <div className={'flex flex-col gap-2'}>
                   text-xs
                   <UIText className={'text-xs'}>Groups are a way of sharing your Events Data with others.</UIText>
                   <UIText className={'text-xs'}>گروپس کی مدد سے آپ اپنا ریکارڈ دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔</UIText>
               </div>

               <div className={'flex flex-col gap-2'}>
                   text-sm
                   <UIText className={'text-sm'}>Groups are a way of sharing your Events Data with others.</UIText>
                   <UIText className={'text-sm'}>گروپس کی مدد سے آپ اپنا ریکارڈ دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔</UIText>
               </div>

               <div className={'flex flex-col gap-2'}>
                   text-base
                   <UIText className={'text-base'}>Groups are a way of sharing your Events Data with others.</UIText>
                   <UIText className={'text-base'}>گروپس کی مدد سے آپ اپنا ریکارڈ دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔</UIText>
               </div>

               <div className={'flex flex-col gap-2'}>
                   text-lg
                   <UIText className={'text-lg'}>Groups are a way of sharing your Events Data with others.</UIText>
                   <UIText className={'text-lg'}>گروپس کی مدد سے آپ اپنا ریکارڈ دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔</UIText>
               </div>

               <div className={'flex flex-col gap-2'}>
                   text-xl
                   <UIText className={'text-xl'}>Groups are a way of sharing your Events Data with others.</UIText>
                   <UIText className={'text-xl'}>گروپس کی مدد سے آپ اپنا ریکارڈ دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔</UIText>
               </div>

               <div className={'flex flex-col gap-2'}>
                   text-2xl
                   <UIText className={'text-2xl'}>Groups are a way of sharing your Events Data with others.</UIText>
                   <UIText className={'text-2xl'}>گروپس کی مدد سے آپ اپنا ریکارڈ دوسرے لوگوں کے ساتھ شیئر کر سکتے ہیں۔</UIText>
               </div>


           </div>
       </PageContainer>
    )
};

export default Page;
