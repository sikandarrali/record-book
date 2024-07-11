"use client";
import { AuthProvider } from "../contexts/AuthContext";
import PagesProvider from "./PagesProvider";
import {TooltipProvider} from "@/components/ui/tooltip";
// import PullToRefresh from "pulltorefreshjs";

const Providers = ({ children }) => {

	// if (typeof window !== 'undefined') {
	// 	const standalone = window.matchMedia("(display-mode: standalone)").matches
	// 	if (standalone) {
	// 		PullToRefresh.init({
	// 			onRefresh() {
	// 				window.location.reload()
	// 			},
	// 		})
	// 	}
	// }



	return (
		<AuthProvider>
			<TooltipProvider>
				<PagesProvider>{children}</PagesProvider>
			</TooltipProvider>
		</AuthProvider>
	);
};

export default Providers;
