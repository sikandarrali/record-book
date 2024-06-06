"use client";
import { useEffect } from "react";

import { account } from "@/components/appwrite/appwrite";
import { useRouter } from "next/navigation";

const Page = () => {
	const router = useRouter();

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		await account.deleteSession("current");
		router.replace("/login");
	};

	return <div>Logout</div>;
};

export default Page;
