"use client";
import { AuthProvider } from "../contexts/AuthContext";
import PagesProvider from "./PagesProvider";
import PullToRefresh from "pulltorefreshjs";

const Providers = ({ children }) => {

	const standalone = window.matchMedia("(display-mode: standalone)").matches
	if (standalone) {
		PullToRefresh.init({
			onRefresh() {
				window.location.reload()
			},
		})
	}
	return (
		<AuthProvider>
			<PagesProvider>{children}</PagesProvider>
		</AuthProvider>
	);
};

export default Providers;
