// context/AuthContext.js

import { createSessionCookie, deleteSessionCookie } from "@/cookies/UserCookie";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {account, getCurrentSession, getCurrentUser} from "../appwrite/appwrite";
import LoadingFallback from "../loaders/LoadingFallback";
import {useMyStore} from "@/store/store";

const AuthContext = createContext();

// @TODO: Login > Show Loader > set user, cookie > hide loader > show content

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [session, setSession] = useState(null);
	const emptyStoreEvent = useMyStore((state) => state.emptyEvents)
	const emptyStoreEventItems = useMyStore((state) => state.emptyEventItems)

	useEffect(() => {
		getLoggedInGoogleUser();
	}, []);

	const getLoggedInGoogleUser = async () => {

		try {
			const currentSession = await getCurrentSession();

			if (currentSession) {
				const userData = await getCurrentUser();
				await createSessionCookie(userData.$id);

				if (userData) {

					fetchGoogleUserData(currentSession?.providerAccessToken)
						.then((googleData) => {
							setUser({
								id: userData?.$id,
								email: googleData?.email,
								verifiedUser: userData?.emailVerification,
								prefs: userData?.prefs,
								status: userData?.status,
								labels: userData?.labels,
								picture: googleData?.picture,
								name: googleData?.name,
							});
						})
						.catch((error) => {

						});
				}

				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
		} catch (error) {
			router.replace('/login')
			setLoading(false)
		}
	};

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
			await account.deleteSession("current").then(() => {
				setUser(null);
				deleteSessionCookie();
				emptyStoreEvent();
				emptyStoreEventItems()
			});

			setTimeout(() => {
				setLoading(false);
				router.replace("/login");
			}, 1000);
		}catch (e){
			// console.log("error logging out: ", e)
			router.replace("/login");
		}
	};

	// const testUSer = {
	// 	id: "fsafdsfdsf324r32qr3e",
	// 	email: "sikandar.chishty@gmail.com",
	// 	name: "Sikandar",
	// };

	const memoedValues = useMemo(
		() => ({
			user,
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
	} catch (error) {}
};
