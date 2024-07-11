"use client";

import {usePathname, useRouter} from "next/navigation";
import { useLayoutEffect } from "react";
import {HOMEPAGE_ROUTE, LOGIN_ROUTE} from "@/lib/routes";
import {useAuth} from "@/components/contexts/AuthContext";

export default function Home() {
	const router = useRouter();
	const pathname = usePathname()
	const {user} = useAuth()

	useLayoutEffect(() => {
		if(user){
			router.replace(HOMEPAGE_ROUTE)
		}else{
			router.replace(LOGIN_ROUTE)
		}
	}, []);

	return <></>;
}
