"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";

export default function Home() {

    return (
        <PageContainer title={'Privacy Policy'} headerTextOrientation={'left'} headerClass={'pt-0 rtl:mt-0 !text-left rtl:pt-0'}>
            <div className="flex flex-col pt-6 pb-20 w-full flex-1 gap-8" dir={'ltr'}>

                <div className={'flex flex-col gap-1'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Introduction'}/>
                    <UIText textOrientation={'left'} text={`Welcome to Record Book ("we", "our", "us"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our books, records, and diary tracking services (the "Service").`}/>
                </div>

                <div className={'flex flex-col gap-8'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Information We Collect'}/>

                    <div className={'flex flex-col gap-4'}>
                        <UIText textOrientation={'left'} weight={'semibold'} text={'Personal Information'}/>
                        <ul className={'list-disc ml-5'}>
                            <li>
                                <UIText textOrientation={'left'} weight={'semibold'} text={'Google Account Information: '}/>
                                <UIText textOrientation={'left'} text={'When you log in using your Google account, we collect your email address, name, and profile picture.'}/>
                            </li>
                            <li>
                                <UIText textOrientation={'left'} weight={'semibold'} text={'Records Data: '}/>
                                <UIText textOrientation={'left'} text={'Information you input related to your books, financial records, diaries, and other relevant data.'}/>
                            </li>
                            <li>
                                <UIText textOrientation={'left'} weight={'semibold'} text={'Groups Data: '}/>
                                <UIText textOrientation={'left'} text={'Information about the groups you create or join to share your records with other users and users in it.'}/>
                            </li>
                        </ul>
                    </div>

                    <div className={'flex flex-col gap-4'}>
                        <UIText textOrientation={'left'} weight={'semibold'} text={'Non-Personal Information'}/>
                        <UIText textOrientation={'left'} text={'We DO NOT track, store any pages you visit, track ip address, browser or device information'}/>
                    </div>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Sharing Your Information'}/>

                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'With Other Users: '}/>
                            <UIText textOrientation={'left'} text={'When you use the groups feature, your record data is shared with other users in the group.'}/>
                        </li>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'With Service Providers: '}/>
                            <UIText textOrientation={'left'} text={'We may share your information with third-party service providers who help us operate our Service.'}/>
                        </li>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Legal Requirements: '}/>
                            <UIText textOrientation={'left'} text={'We may disclose your information if required to do so by law or in response to valid requests by public authorities.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Data Security'}/>
                    <UIText textOrientation={'left'} text={'We implement a variety of security measures to protect your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Your Rights'}/>
                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Access and Update: '}/>
                            <UIText textOrientation={'left'} text={'You can access and update your personal information through your account settings.'}/>
                        </li>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Deletion '}/>
                            <UIText textOrientation={'left'} text={'You can request the deletion of your account and personal data by contacting us.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Changes to This Privacy Policy'}/>
                    <UIText textOrientation={'left'} text={'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Contact Us'}/>
                    <UIText textOrientation={'left'} text={'If you have any questions about this Privacy Policy, please contact us at '}/>
                    <UIText textOrientation={'left'} className={'text-primary'} weight={'medium'} text={'aasaanapps.store@gmail.com'}/>
                </div>


            </div>
        </PageContainer>
    );
}


