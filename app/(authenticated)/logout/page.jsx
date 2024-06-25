"use client";
import { useEffect } from "react";

import { account } from "@/components/appwrite/appwrite";
import { useRouter } from "next/navigation";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";

const Page = () => {
	const router = useRouter();
	const {onLogout} = useAuth()

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		onLogout()
	};

	return <div>If you&apos;re not logged out automatically, click here <Button onClick={()=> onLogout()}>Logout</Button></div>;
};

export default Page;
