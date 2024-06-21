"use client";
import { AuthProvider } from "../contexts/AuthContext";
import PagesProvider from "./PagesProvider";

const Providers = ({ children }) => {
	return (
		<AuthProvider>
			<PagesProvider>{children}</PagesProvider>
		</AuthProvider>
	);
};

export default Providers;
