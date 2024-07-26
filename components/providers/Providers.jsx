"use client";
import { AuthProvider } from "../contexts/AuthContext";
import {TooltipProvider} from "@/components/ui/tooltip";
import {DataProvider} from "@/components/contexts/DataContext";
import LoadingFallback from "@/components/loaders/LoadingFallback";
import {useParams, useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {I18nProviderClient} from "@/locales/client";
import {NextJSThemeProvider} from "@/components/providers/NextJSThemeProvider";
import {useLayoutEffect, useState} from "react";
import Cookies from "js-cookie";
import {COOKIE_THEME_NAME, DEFAULT_THEME} from "@/lib/defaults";
// import PullToRefresh from "pulltorefreshjs";

const Providers = ({ children }) => {

	const params = useParams()

	return (
		<I18nProviderClient
			locale={params.locale}
			fallbackLocale="ur"
			fallback={<LoadingFallback />}
		>
			<AuthProvider>
				<DataProvider>
					<NextJSThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
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
					</NextJSThemeProvider>
				</DataProvider>
			</AuthProvider>
		</I18nProviderClient>
	);
};

export default Providers;
