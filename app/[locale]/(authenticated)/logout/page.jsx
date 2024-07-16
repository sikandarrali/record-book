"use client";
import { useEffect } from "react";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import UIText from "@/components/theme/UIText"
import {useScopedI18n} from "@/locales/client";

const Page = () => {
	const {onLogout} = useAuth()
	const t = useScopedI18n('logout')

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		onLogout()
	};

	return <UIText>{t('text')} <Button onClick={()=> onLogout()}>{t('btnLogout')}</Button></UIText>;
};

export default Page;
