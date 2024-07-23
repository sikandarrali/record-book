import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {account} from "../appwrite/appwrite";
import LoadingFallback from "../loaders/LoadingFallback";
import {HOMEPAGE_ROUTE, LOGIN_ROUTE, PROTECTED_ROUTES} from "@/lib/routes";
import {useChangeLocale, useCurrentLocale} from "@/locales/client";
import Cookies from 'js-cookie'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname()
	const changeLocale = useChangeLocale()
	const currentLocale = useCurrentLocale()

	useLayoutEffect(() => {
		getLoggedInGoogleUser().then(()=> setLoading(false));
	}, []);

	const getLoggedInGoogleUser = async () => {

		let userPrefs = null
		try {
			const currentSession = await account.getSession('current');
			const currentUser = await account.get();
			setUser(currentUser)
			userPrefs = currentUser.prefs
			changeLocale(userPrefs?.lang || 'ur')

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
			if(currentUser && pathname === LOGIN_ROUTE) router.replace(HOMEPAGE_ROUTE);
		}
		catch (e){
			setUser(null)
			setLoading(false)
			if(PROTECTED_ROUTES.includes(pathname)){
				router.replace(LOGIN_ROUTE)
			}
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
			Cookies.remove('Next-Locale');
			setLoading(false)
			router.replace("/login");
		}catch (e){
			// console.log(e)
		}
		finally {
			setLoading(false)
			router.replace("/login");
		}
	};

	useLayoutEffect(() => {
		if(user) router.replace(HOMEPAGE_ROUTE)
	}, [router]);

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

