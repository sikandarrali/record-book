"use client";
import PageContainer from "@/components/providers/PageContainer";
import {useI18n, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

export default function Home() {
    const t = useScopedI18n('login')
    const t2 = useI18n()

    return (
        <PageContainer>
            <div className="flex flex-col pt-6 pb-20 w-full flex-1 gap-8" dir={'ltr'}>

                <UIText variant={'heading'} className={'text-primary'} text={'Privacy Policy'}/>

                <div className={'flex flex-col gap-1'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Introduction'}/>
                    <UIText text={`Welcome to Shadi Kharcha Record ("we", "our", "us"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our marriage expense and gift tracking services (the "Service").`}/>
                </div>

                <div className={'flex flex-col gap-8'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Information We Collect'}/>

                    <div className={'flex flex-col gap-4'}>
                        <UIText weight={'semibold'} text={'Personal Information'}/>
                        <ul className={'list-disc ml-5'}>
                            <li>
                                <UIText weight={'semibold'} text={'Google Account Information: '}/>
                                <UIText text={'When you log in using your Google account, we collect your email address, name, and profile picture.'}/>
                            </li>
                            <li>
                                <UIText weight={'semibold'} text={'Marriage Expense Data: '}/>
                                <UIText text={'Information you input related to your marriage expenses, gifts, and other relevant data.'}/>
                            </li>
                            <li>
                                <UIText weight={'semibold'} text={'Groups Data: '}/>
                                <UIText text={'Information about the groups you create or join to share your marriage expense data with other users and users in it.'}/>
                            </li>
                        </ul>
                    </div>

                    <div className={'flex flex-col gap-4'}>
                        <UIText weight={'semibold'} text={'Non-Personal Information'}/>
                        <UIText text={'We DO NOT track, store any pages you visit, track ip address, browser or device information'}/>
                    </div>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Sharing Your Information'}/>

                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText weight={'semibold'} text={'With Other Users: '}/>
                            <UIText text={'When you use the groups feature, your marriage expense data is shared with other users in the group.'}/>
                        </li>
                        <li>
                            <UIText weight={'semibold'} text={'With Service Providers: '}/>
                            <UIText text={'We may share your information with third-party service providers who help us operate our Service.'}/>
                        </li>
                        <li>
                            <UIText weight={'semibold'} text={'Legal Requirements: '}/>
                            <UIText text={'We may disclose your information if required to do so by law or in response to valid requests by public authorities.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Data Security'}/>
                    <UIText text={'We implement a variety of security measures to protect your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Your Rights'}/>
                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText weight={'semibold'} text={'Access and Update: '}/>
                            <UIText text={'You can access and update your personal information through your account settings.'}/>
                        </li>
                        <li>
                            <UIText weight={'semibold'} text={'Deletion '}/>
                            <UIText text={'You can request the deletion of your account and personal data by contacting us.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Changes to This Privacy Policy'}/>
                    <UIText text={'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText variant={'lg'} weight={'semibold'} text={'Contact Us'}/>
                    <UIText text={'If you have any questions about this Privacy Policy, please contact us at '}/>
                    <UIText className={'text-primary'} weight={'medium'} text={'aasaanapps.store@gmail.com'}/>
                </div>


            </div>
        </PageContainer>
    );
}


