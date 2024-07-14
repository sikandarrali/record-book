"use client";
import Logo from "@/public/logo.png"
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {useLayoutEffect, useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {Check, MoveLeft, XIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/components/contexts/AuthContext";
import Link from "next/link";
import {ParseErrorCodes} from "@/lib/parseErrorCodes";

const Page = () => {

	const searchParams = useSearchParams()

	const membershipId = searchParams.get('membershipId');
	const userId = searchParams.get('userId');
	const secret = searchParams.get('secret');
	const teamId = searchParams.get('teamId');

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
					setError({correct: true, text: 'Groups Joined!'})
				}
			}catch (e) {
				setError({correct: false, text: ParseErrorCodes(e.response.type)})

				if(e.response.type === 'membership_already_confirmed'){
					setAlreadyJoined(true)
				}else{
					setAlreadyJoined(false)
				}
			}

		}

		return ()=> checkMembership()
	}, []);


	// if(!userId || !secret || !userId || !teamId){
	// 	redirect('/login')
	// 	return <></>
	// }

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

			<div className={'flex flex-col mt-20 mb-8 mx-4'}>
				{showError &&

					<>
					{error.correct ?
						<div className={'flex flex-col w-full'}>
							<div className={'flex w-full gap-2 border-2 border-green-400 rounded-md p-3 px-4'}>
								<Check className={'text-green-500 stroke-[3] mt-0.5'}/>
								<div className={'flex flex-col gap-1'}>
									<p className={'text-lg text-green-500 font-semibold'}>Group Joined</p>
									<p>{`You've successfully joined this Group.`}</p>
								</div>
							</div>
						</div>
					:
						<div className={'flex flex-col w-full'}>
							<div className={'flex w-full gap-2 border-2 border-red-400 rounded-md p-3 px-4'}>
								<XIcon className={'text-red-700 stroke-[3] mt-0.5'}/>
								<div className={'flex flex-col gap-1'}>
									<p className={'text-lg text-red-700 font-semibold'}>{alreadyJoined ? 'Already Joined' : 'Unable to Join'}</p>
									<p>{error.text}</p>
								</div>
							</div>
						</div>
					}

						<div className={'flex flex-col gap-4 mt-16 '}>
							{!user && <p className={'font-semibold'}>You can login and Check your groups:</p>}

							<Link href={user ? '/groups' : '/login'}>
								<Button
									variant={'outline'}
									className={'gap-2'}
								>
									<MoveLeft className={'w-4 h-4'}/> {user ? 'Back to Groups' : 'Login Now'}
								</Button>
							</Link>
						</div>

					</>
				}
			</div>

		</div>
	)
};

export default Page;
