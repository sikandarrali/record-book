"use client";
import {useLayoutEffect} from "react";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import UIText from "@/components/theme/UIText"
import {useScopedI18n} from "@/locales/client";

const Page = () => {
	const {onLogout} = useAuth()
	const t = useScopedI18n('logout')

	useLayoutEffect(() => {
		onLogout()
	}, []);

	return <Button onClick={()=> onLogout()}>
		<UIText text={t('text') + t('btnLogout')}></UIText>
	</Button>;
};

export default Page;
