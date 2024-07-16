import "@/styles/globals.css";
import {Inter} from "next/font/google";
import {Noto_Nastaliq_Urdu, Noto_Sans_Arabic, Gulzar} from "next/font/google";
import localFont from "next/font/local"
import {NetworkStatusIndicator} from "@/components/NetworkStatus/NetworkStatusIndicator";
import HolyLoader from "holy-loader";
import Providers from "@/components/providers/Providers";
import {cn} from "@/lib/utils";

const fontSans = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

// const fontUrdu = Noto_Nastaliq_Urdu({
// 	subsets: ["latin"],
// 	weight: ['400', '500', '600', '700'],
// 	variable: "--font-urdu"
// });

// const fontUrdu = Noto_Sans_Arabic({
// 	subsets: ["arabic"],
// 	display: "swap",
// 	variable: "--font-urdu",
// });

const fontUrdu = localFont({
	display: "swap",
	// src: "../../fonts/XB-Roya-Bold.woff",
	// src: "../../fonts/JameelNooriNastaleeq.woff",
	src: "../../fonts/NafeesWeb.woff",
	// src: "../../fonts/Nafees-Nastaleeq.woff",
	variable: "--font-urdu",
});

// const fontUrdu = localFont({
// 	display: "swap",
// 	src: "../../fonts/AlviLahoriNastaleeq.woff",
// 	variable: "--font-urdu",
// });

// const fontUrdu = Gulzar({
// 	subsets: ["arabic"],
// 	weight: ['400'],
// 	display: "swap",
// 	variable: "--font-urdu",
// });

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
	themeColor: "#FFFFFF",
};

export default async function RootLayout({ children, params }) {

	return (
		<html lang={params.locale} suppressHydrationWarning>
			<head>
				<title>Shadi Kharcha Record</title>
				<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
				<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5"/>
			</head>
			<body
				dir={params.locale === 'ur' ? 'rtl' : 'ltr'}
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable, fontUrdu.variable
				)}
			>

				{/*<NetworkStatusIndicator />*/}

				{/* topbar loader */}
				<HolyLoader
					// color="#E11D48"
					color="#000"
					height="4px"
					speed={250}
					easing="linear"
					showSpinner
				/>

				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
