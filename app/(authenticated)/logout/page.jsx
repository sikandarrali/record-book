"use client";
import { useEffect } from "react";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import Text from "@/components/theme/Text"
import {useTranslations} from "next-intl";

const Page = () => {
	const {onLogout} = useAuth()
	const t = useTranslations('logout')

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		onLogout()
	};

	return <Text>{t('text')} <Button onClick={()=> onLogout()}>{t('btnLogout')}</Button></Text>;
};

export default Page;
