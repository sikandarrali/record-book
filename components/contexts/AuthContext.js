// context/AuthContext.js

import { createSessionCookie, deleteSessionCookie } from "@/cookies/UserCookie";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

const AuthContext = createContext();

// @TODO: Login > Show Loader > set user, cookie > hide loader > show content

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [session, setSession] = useState(null);
	const emptyStoreEvent = useMyStore((state) => state.emptyEvents)
	const emptyStoreEventItems = useMyStore((state) => state.emptyEventItems)
	const updateUser = useMyStore((state)=> state.updateUser)
	const [refreshChanges, setRefreshChanges] = useState(false)
	const [tempUser, setTempUser] = useState(null)

	useEffect(() => {
		getLoggedInGoogleUser();
	}, []);

	const getLoggedInGoogleUser = async () => {
		setLoading(true)

		try {
			const currentSession = await getCurrentSession();

			if (currentSession) {
				const currentUser = await getCurrentUser();
				setUser(currentUser)
				await createSessionCookie(currentUser.$id);

				if (currentUser) {
					fetchGoogleUserData(currentSession.providerAccessToken)
						.then((googleData) => {
							if(googleData){
								updateUserPrefs(googleData?.picture)
							}
						})
						.catch((error) => {
							// console.log(error)
						});
				}
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
			else{
				// router.replace('/login')
			}
		} catch (error) {
			setLoading(false)
		}
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
			await deleteSessionCookie();
			await account.deleteSession("current").then(() => {
				setUser(null);
				emptyStoreEvent();
				emptyStoreEventItems();
			});

			setTimeout(() => {
				setLoading(false);
				router.replace("/login");
			}, 1000);
		}catch (e){
			// console.log("error logging out: ", e)
			setLoading(false);
			router.replace("/login");
		}
	};

	const memoedValues = useMemo(
		() => ({
			user,
			setUser,
			session,
		}),
		[user, session]
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
			{loading ? <LoadingFallback /> : <>{children}</>}
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

