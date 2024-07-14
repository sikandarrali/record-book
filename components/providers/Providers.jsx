"use client";
import { AuthProvider } from "../contexts/AuthContext";
import PagesProvider from "./PagesProvider";
import {TooltipProvider} from "@/components/ui/tooltip";
import {DataProvider} from "@/components/contexts/DataContext";
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
			<DataProvider>
				<TooltipProvider>
					<PagesProvider>{children}</PagesProvider>
				</TooltipProvider>
			</DataProvider>
		</AuthProvider>
	);
};

export default Providers;
