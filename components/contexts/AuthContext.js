// context/AuthContext.js
import { addUserCookie, deleteUserCookie } from "@/cookies/UserCookie";
import { redirectRoutes } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite/appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const router = useRouter();

	const pathname = usePathname(router);

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await account.get();
				setUser(response);
			} catch (error) {
				setUser(null);
			}
		};

		getUser();
		console.log("runing");
		// if (!getUserCookie()) redirect("/login");
	}, []);

	// const ifUserLogged = async (second) => {
	// 	const userSession = await account.getSession("current");
	// 	// if (!userSession) sreplace("/login");
	// };

	// useEffect(() => {
	// 	ifUserLogged();
	// }, [router]);

	const login = async (email, password) => {
		try {
			await account.createEmailPasswordSession(email, password);
			const response = await account.get();
			setUser(response);
			addUserCookie(response.name);
			// spush(redirectRoutes.loggedIn);
		} catch (error) {
			console.error(error.message);
		}

		// const fakeUser = {
		// 	name: "Sikandar Ali",
		// 	email: "sikandar.chishty@gmail.com",
		// };
		// setUser(fakeUser);
		spush(redirectRoutes.loggedIn);
		// addUserCookie("Sikandar Ali");
	};

	const signup = async (email, password, name) => {
		try {
			await account.create("unique()", email, password, name);
			await login(email, password);
		} catch (error) {
			console.error(error);
		}
	};

	const logout = async () => {
		try {
			await account.deleteSession("current");
			deleteUserCookie("currentUser");
			setUser(null);
			console.log("reched heer");
			// redirect("/login");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
