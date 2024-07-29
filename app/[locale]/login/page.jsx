"use client";
import { useAuth } from "@/components/contexts/AuthContext";
import PageContainer from "@/components/providers/PageContainer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "../../../public/logo.png"
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import Link from "next/link";
import {redirect} from "next/navigation";
import {HOMEPAGE_ROUTE} from "@/lib/routes";

export default function Home() {
	const { onGoogleWithLogin, user } = useAuth();
	const t = useScopedI18n('login')

	if(user) {
		redirect(HOMEPAGE_ROUTE)
		return <></>
	}

	return (
		<PageContainer hideNavbar>
			<div className="flex flex-col pt-8 w-full flex-1">
				<Image
					src={Logo}
					alt="Logo"
					className="mx-auto"
					priority
					width={200}
					height={79}
				/>

				<Button
					onClick={() => onGoogleWithLogin()}
					className="mx-4 mt-20 ltr:py-4 rtl:py-5 flex items-center gap-2 rtl:gap-3"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
							fill="currentColor"
						/>
					</svg>
					<UIText weight={'semibold'} variant={'button'} text={t('withGoogle')}/>
				</Button>


				<div className={'text-sm mt-8 mb-4 text-center left-1/2 w-full -translate-x-1/2 fixed bottom-10'} dir={'ltr'}>
					<span>By Logging In, you agree to our</span><br/>
					<Link href={'/terms-of-service'} className={'text-primary font-semibold'}>Terms of Service</Link>{" "}
					and{" "}
					<Link href={'/privacy-policy'} className={'text-primary font-semibold'}>Privacy Policy</Link>{" "}
				</div>
			</div>
		</PageContainer>
	);
}


