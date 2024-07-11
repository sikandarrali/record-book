// context/AuthContext.js

import { createSessionCookie, deleteSessionCookie } from "@/cookies/UserCookie";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {
	account,
	getCurrentSession,
	getCurrentUser,
	getUserInCollection, ID,
	refreshCurrentSession, teams
} from "../appwrite/appwrite";
import LoadingFallback from "../loaders/LoadingFallback";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {error} from "next/dist/build/output/log";
import {HOMEPAGE_ROUTE, LOGIN_ROUTE, PROTECTED_ROUTES} from "@/lib/routes";

const AuthContext = createContext();

// @TODO: Login > Show Loader > set user, cookie > hide loader > show content

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname()

	useLayoutEffect(() => {
		getLoggedInGoogleUser().then(r => setLoading(false));
	}, []);

	const getLoggedInGoogleUser = async () => {
		try {
			const currentSession = await account.getSession('current');
			const currentUser = await account.get();
			setUser(currentUser)

			fetchGoogleUserData(currentSession.providerAccessToken)
			.then((googleData) => {
				if(googleData){
					updateUserPrefs(googleData?.picture)
				}
			})
			.catch((error) => {
				// console.log(error)
			});

			if(pathname === LOGIN_ROUTE) router.replace(HOMEPAGE_ROUTE);
		}
		catch (e){
			setUser(null)
			if(PROTECTED_ROUTES.includes(pathname)){
				router.replace(LOGIN_ROUTE)
			}
		}
		setLoading(false)
	};

	const updateUserPrefs = async (picture) => {
		await account.updatePrefs({
			picture: picture,
			lang: 'en',
			theme: 'light'
		})
	}

	const onGoogleWithLogin = async () => {
		account.createOAuth2Session(
			"google",
			process.env.NEXT_PUBLIC_CALLBACK_AFTER_LOGIN,
			process.env.NEXT_PUBLIC_CALLBACK_AFTER_LOGIN_FAILED
		);
	};

	const onLogout = async () => {
		setLoading(true);

		try {
			await account.deleteSession("current");
			setUser(null);
		}catch (e){}
		setLoading(false);
		router.replace("/login");
	};

	const memoedValues = useMemo(
		() => ({
			user,
			setUser
		}),
		[user]
	);

	const otherValues = {
		onLogout,
		loading,
		setLoading,
		onGoogleWithLogin,
	};

	const values = { ...memoedValues, ...otherValues };

	return (
		<AuthContext.Provider value={values}>
			{loading ? <LoadingFallback /> : children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

const fetchGoogleUserData = async (accessToken) => {

	try {
		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v2/userinfo",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		// Extract relevant user data
		const { name, email, picture } = response.data;

		return { name, email, picture };
	} catch (error) {

	}
};

