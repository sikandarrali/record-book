"use client";
import { account } from "@/components/appwrite/appwrite";
import { useAuth } from "@/components/contexts/AuthContext";
import PageContainer from "@/components/providers/PageContainer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
	const { user } = useAuth();
	const router = useRouter();

	const onLogin = (second) => {
		account.createOAuth2Session(
			"google",
			"http://localhost:3000/",
			"http://localhost:3000/404"
		);
	};

	return (
		<PageContainer hideNavbar>
			<div className="flex flex-col pt-8 w-full flex-1">
				<Image
					src={"/logo.png"}
					width={200}
					height={150}
					alt="Logo"
					className="mx-auto"
				/>

				<Button onClick={() => onLogin()} className="mx-4 mt-20">
					Login with Google
				</Button>
			</div>
		</PageContainer>
	);
}
