"use client";
import { AuthProvider } from "../contexts/AuthContext";
import {TooltipProvider} from "@/components/ui/tooltip";
import {DataProvider} from "@/components/contexts/DataContext";
import LoadingFallback from "@/components/loaders/LoadingFallback";
import {useParams, useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {I18nProviderClient} from "@/locales/client";
import {useEffect} from "react";
// import PullToRefresh from "pulltorefreshjs";

const Providers = ({ children }) => {

	const params = useParams()
	const router = useRouter()


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
		<I18nProviderClient
			locale={params.locale}
			fallbackLocale="ur"
			fallback={<LoadingFallback />}
		>
			<AuthProvider>
				<DataProvider>
					<TooltipProvider>
						<ToastContainer
							limit={1}
							autoClose={1500}
							position="top-center"
							pauseOnFocusLoss
							draggable={'touch'}
							theme="light"
						/>
						<div className="relative max-w-screen-lg lg:max-w-lg mx-auto">
							{children}
						</div>
					</TooltipProvider>
				</DataProvider>
			</AuthProvider>
		</I18nProviderClient>
	);
};

export default Providers;
