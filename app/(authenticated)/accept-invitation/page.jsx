"use client";
import Logo from "./../../../public/logo.png"
import Image from "next/image";
import Text from "@/components/theme/Text"
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {account} from "@/components/appwrite/appwrite";
import PageContainer from "@/components/providers/PageContainer";


const Page = () => {

	const searchParams = useSearchParams()

	const userId = searchParams.get('userId');
	const secret = searchParams.get('secret');

	const [verifying, setVerifying] = useState(true)

	useEffect(() => {
		const unsub = async () =>{
			if(userId && secret){
				const response = await account.updateVerification(userId, secret);

				if(response){
					setVerifying(false)
				}
			}
		}

		return () => unsub()
	}, []);

	return(
		<PageContainer>
			<div className={'flex flex-col p-6'}>

				<Image
					src={Logo}
					alt="Logo"
					className="mx-auto"
					priority
					width={200}
					height={79}
				/>

				<div className={'flex flex-col items-center mt-16 gap-4 text-center'}>
					<Text className={'text-primary'} variant={'h2'}>Accept Invitation</Text>
					{verifying ?
						<Text>Verifying your account, <br/>this could take a few seconds.</Text>
						:
						<Text>Verified</Text>
					}
				</div>

			</div>
		</PageContainer>
	)
};

export default Page;
