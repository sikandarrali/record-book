"use client"
import axios from "axios";
import {useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {account} from "../appwrite/appwrite";
import LoadingFallback from "../loaders/LoadingFallback";
import {useCurrentLocale} from "@/locales/client";
import Cookies from 'js-cookie'
import {EncodeUserId} from "@/lib/EncodeDecode";
import {LOCAL_THEME_NAME, DEFAULT_THEME} from "@/lib/defaults";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const currentLocale = useCurrentLocale()

	useLayoutEffect(() => {
		getLoggedInGoogleUser().then(()=> setLoading(false));
	}, []);

	const getLoggedInGoogleUser = async () => {

		// fix: if lang is changed from another device,
		// it will remove on load and sets from user prefs
		Cookies.remove('Next-Locale');

		let userPrefs = null
		try {
			const currentSession = await account.getSession('current');
			const currentUser = await account.get();
			setUser(currentUser)
			userPrefs = currentUser.prefs
			Cookies.set(process.env.NEXT_PUBLIC_USER_SESSION_COOKIE_NAME, EncodeUserId(currentUser.$id), {sameSite: 'None', secure: true});
			localStorage.setItem(LOCAL_THEME_NAME, currentUser?.prefs?.theme || DEFAULT_THEME.name)

			fetchGoogleUserData(currentSession.providerAccessToken)
			.then((googleData) => {
				if(googleData){
					updateUserPrefs(userPrefs, googleData?.picture)
				}
			})
			.catch((error) => {
				// console.log(error)
			});

			if(userPrefs?.lang === currentLocale){
				setLoading(false)
			}
		}
		catch (e){
			setUser(null)
			setLoading(false)
		}
		finally {
			setLoading(false)
		}
	};

	useEffect(() => {
		if(user) setLoading(false)
	}, [router]);

	const updateUserPrefs = async (prefs, picture) => {
		let tempPrefs = {...prefs, picture:picture}
		if(!prefs.lang)
			tempPrefs = {...tempPrefs, lang: 'ur'}
		if(!prefs.fontSize)
			tempPrefs = {...tempPrefs, fontSize: 'base'}
		if(!prefs.theme) {
			tempPrefs = {...tempPrefs, theme: DEFAULT_THEME.name};
			localStorage.setItem(LOCAL_THEME_NAME, DEFAULT_THEME.name)
		}else{
			localStorage.setItem(LOCAL_THEME_NAME, prefs.theme || DEFAULT_THEME.name)
		}

		await account.updatePrefs(tempPrefs)
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
			// await account.deleteSessions();
			setUser(null);
			localStorage.removeItem(LOCAL_THEME_NAME)
			Cookies.remove(process.env.NEXT_PUBLIC_USER_SESSION_COOKIE_NAME);
			Cookies.remove('Next-Locale');
			setLoading(false)
			router.replace("/login");
		}catch (e){}
		finally {
			setLoading(false)
			router.replace("/login");
		}
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
		onGoogleWithLogin
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

