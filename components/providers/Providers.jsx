"use client";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";
import PagesProvider from "./PagesProvider";

const Providers = ({ children }) => {
	return (
		<AuthProvider>
			<DataProvider>
				<PagesProvider>{children}</PagesProvider>
			</DataProvider>
		</AuthProvider>
	);
};

export default Providers;
