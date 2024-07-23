"use client";
import Logo from "@/public/logo.png"
import Image from "next/image";
import {useParams, useSearchParams} from "next/navigation";
import {useLayoutEffect, useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {Check, MoveLeft, XIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/components/contexts/AuthContext";
import Link from "next/link";
import {ParseErrorCodes} from "@/lib/parseErrorCodes";
import UIText from "@/components/theme/UIText";
import {useCurrentLocale, useScopedI18n} from "@/locales/client";
import Loader from "@/components/loaders/loader";

const Page = () => {

	const searchParams = useSearchParams()

	const membershipId = searchParams.get('membershipId');
	const userId = searchParams.get('userId');
	const secret = searchParams.get('secret');
	const teamId = searchParams.get('teamId');

	const t = useScopedI18n('joinGroup');

	const {user} = useAuth()
	const [error, setError] = useState({correct: true, text:''})
	const [showError, setShowError] = useState(false)
	const [alreadyJoined, setAlreadyJoined] = useState(false)

	useLayoutEffect(() => {
		const checkMembership = async () =>{
			setShowError(true)
			try {
				const result = await teams.updateMembershipStatus(
					teamId, // teamId
					membershipId, // membershipId
					userId, // userId
					secret // secret
				);
				if(result){
					setError({correct: true, text: t('titleJoined')})
				}
			}catch (e) {
				setError({correct: false, text: t(e.response.type)})
			}
		}

		return ()=> checkMembership()
	}, []);


	return(
		<div className={'flex flex-col p-6 relative'}>

			<Image
				src={Logo}
				alt="Logo"
				className="mx-auto"
				priority
				width={200}
				height={79}
			/>
			{showError.toString()}
			{showError &&
				<div className={'flex flex-col mt-20 mb-8 mx-4'}>
					{error.correct ?
						<div className={'flex w-full flex-1 items-center gap-4 border-2 border-green-400 rounded-md p-3 px-4'}>
							<Check className={'text-green-500 stroke-[3] mt-0.5'}/>
							<div className={'flex flex-col gap-1'}>
								<UIText className={'text-green-500'} text={t(error.text)}/>
							</div>
						</div>
						:
						<div className={'flex w-full flex-1 items-center gap-4 border-2 border-red-400 rounded-md p-3 px-4'}>
							<XIcon className={'text-red-700 stroke-[3] mt-0.5 rtl:mt-2'}/>
							<div className={'flex flex-col gap-1'}>
								<UIText className={'text-red-700'} weight={'semibold'} text={error.text}/>
							</div>
						</div>
					}
					<div className={'flex flex-col gap-4 mt-16 '}>
						{!user && <UIText text={t('loginAndCheckGroups')}/>}

						<Link href={user ? '/groups' : '/login'}>
							<Button
								variant={'outline'}
								className={'gap-2 rtl:flex-row-reverse'}
							>
								<MoveLeft className={'w-4 h-4'}/>
								<UIText variant={'button'} className={'rtl:pt-2'} text={user ? t('btnBackToGroups') : t('btnLoginNow')}/>
							</Button>
						</Link>
					</div>
				</div>
			}
		</div>
	)
};

export default Page;
