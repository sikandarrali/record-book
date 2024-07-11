import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import PagesProvider from "@/components/providers/PagesProvider";
import Providers from "@/components/providers/Providers";
import { cn } from "@/lib/utils";
import {NetworkStatusIndicator} from "@/components/NetworkStatus/NetworkStatusIndicator";
import {ToastContainer} from "react-toastify";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const APP_NAME = "Shadi Kharcha";
const APP_DEFAULT_TITLE = "Shadi Kharcha";
const APP_TITLE_TEMPLATE = "%s - Shadi Kharcha";
const APP_DESCRIPTION = "All your Shadi Records at one place";

export const metadata = {
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: APP_DEFAULT_TITLE,
		// startUpImage: [],
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
};

export const viewport = {
	themeColor: "#E11D48",
};

export default function RootLayout({ children }) {

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<title>Shadi Kharcha Record</title>
				<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
				<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5"/>
			</head>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<NetworkStatusIndicator />
				<Providers>
					<PagesProvider>{children}</PagesProvider>
				</Providers>
			</body>
		</html>
	);
}
