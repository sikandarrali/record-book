// context/AuthContext.js

import {
	createSessionCookie,
	deleteSessionCookie,
	getSessionCookie,
} from "@/cookies/UserCookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useLayoutEffect, useState } from "react";
import { account } from "../appwrite/appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const pathname = usePathname();

	useLayoutEffect(() => {
		const getUser = async () => {
			try {
				const response = await account.get();
				const session = await account.getSession("current");

				setUser(response);
				createSessionCookie(session?.$id);

				// router.push("/");
			} catch (error) {
				setUser(null);
			}
		};

		if (!user) {
			getUser();
			setLoading(false);
		}
	}, []);

	useLayoutEffect(() => {
		if (!user) deleteSessionCookie();
	}, []);
	useLayoutEffect(() => {
		if (getSessionCookie()) setLoading(false);
	}, []);

	const logout = async () => {
		try {
			await account.deleteSession("current");
			setUser(null);

			deleteSessionCookie();
			router.push("/login");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
