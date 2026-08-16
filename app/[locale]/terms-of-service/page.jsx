"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";

export default function Home() {

    return (
        <PageContainer title={'Terms of Service'} headerTextOrientation={'left'} headerClass={'pt-0 rtl:mt-0 !text-left rtl:pt-0'}>
            <div className="flex flex-col pt-6 pb-20 w-full flex-1 gap-8" dir={'ltr'}>

                <div className={'flex flex-col gap-1'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Introduction'}/>
                    <UIText textOrientation={'left'} text={`Welcome to Record Book ("we", "our", "us"). These Terms of Service ("Terms") govern your use of our books, records, and diary tracking services (the "Service").`}/>
                </div>

                <div className={'flex flex-col gap-1'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Acceptance of Terms'}/>
                    <UIText textOrientation={'left'} text={`By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our Service.`}/>
                </div>

                <div className={'flex flex-col gap-1'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Eligibility'}/>
                    <UIText textOrientation={'left'} text={`Users of any age group can use this service.`}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'User Accounts'}/>
                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Account Creation: '}/>
                            <UIText textOrientation={'left'} text={'You must create an account using your Google account to use our Service.'}/>
                        </li>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Account Responsibility: '}/>
                            <UIText textOrientation={'left'} text={'You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Use of Service'}/>
                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Permitted Use: '}/>
                            <UIText textOrientation={'left'} text={'You may use our Service for personal, non-commercial purposes.'}/>
                        </li>
                        <li>
                            <UIText textOrientation={'left'} weight={'semibold'} text={'Prohibited Use: '}/>
                            <UIText textOrientation={'left'} text={'You may not use our Service for any illegal or unauthorized purpose. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of our Service without our express written permission.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Groups Feature'}/>
                    <UIText textOrientation={'left'} text={'You may use the groups feature to share your record data with other users. By using this feature, you agree to:'}/>
                    <ul className={'list-disc ml-5'}>
                        <li>
                            <UIText textOrientation={'left'} text={'Only share data with users you trust.'}/>
                        </li>
                        <li>
                            <UIText textOrientation={'left'} text={'Respect the privacy of other users.'}/>
                        </li>
                    </ul>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Termination'}/>
                    <UIText textOrientation={'left'} text={'We reserve the right to terminate or suspend your account and access to our Service at our sole discretion, without notice or liability, for conduct that we believe violates these Terms or is harmful to other users.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Disclaimer of Warranties'}/>
                    <UIText textOrientation={'left'} text={'Our Service is provided on an "as is" and "as available" basis. We do not warrant that our Service will be uninterrupted or error-free.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Limitation of Liability'}/>
                    <UIText textOrientation={'left'} text={'In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our Service.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Governing Law'}/>
                    <UIText textOrientation={'left'} text={'These Terms and any disputes related to these Terms or the Service will be governed by and construed in accordance with general principles of law applicable to agreements made and to be performed entirely within the user\'s local jurisdiction, without regard to conflict of law principles.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Changes to These Terms'}/>
                    <UIText textOrientation={'left'} text={'We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our website.'}/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <UIText textOrientation={'left'} variant={'lg'} weight={'semibold'} text={'Contact Us'}/>
                    <UIText textOrientation={'left'} text={'If you have any questions about this these Terms, please contact us at '}/>
                    <UIText textOrientation={'left'} className={'text-primary'} weight={'medium'} text={'aasaanapps.store@gmail.com'}/>
                </div>


            </div>
        </PageContainer>
    );
}


