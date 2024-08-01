import "@/styles/globals.css";
import {NetworkStatusIndicator} from "@/components/NetworkStatus/NetworkStatusIndicator";
import HolyLoader from "holy-loader";
import Providers from "@/components/providers/Providers";
import {cn} from "@/lib/utils";
import {Inter, Noto_Nastaliq_Urdu} from "@next/font/google";
import localFont from "@next/font/local";


const fontSans = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontUrdu = Noto_Nastaliq_Urdu({
	subsets: ["latin"],
	weight: ["variable"],
	variable: "--font-urdu",
});

const fontUrduHeading = localFont({
	display: "swap",
	src: "../../fonts/Nafees Riqa.ttf",
	variable: "--font-urdu-heading",
});

const APP_NAME = "Record Book";
const APP_DEFAULT_TITLE = "Record Book";
const APP_TITLE_TEMPLATE = "Record Book";
const APP_DESCRIPTION = "All your records in one place. Say goodbye to your record diaries";

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

// export const viewport = {
// 	themeColor: APP_THEME.VIEWPORT,
// };


export default async function RootLayout({ children, params }) {

	return (
		<html
			lang={params.locale}
			suppressHydrationWarning
			style={{width: "100%", height: "100%"}}
		>
		<head>
			<title>Record Book</title>
			<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
			<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
			<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
			<meta name="theme-color" content="#0B0A0A" id="theme-color" />
		</head>
		<body
			dir={params.locale === 'ur' ? 'rtl' : 'ltr'}
			className={cn(
				"min-h-screen font-sans antialiased",
				fontSans.variable,
				fontUrdu.variable,
				fontUrduHeading.variable,
			)}
		>

		<NetworkStatusIndicator />

		{/* topbar loader */}
		<HolyLoader
			// color="#E11D48"
			// color="#000"
			color="linear-gradient(90deg, rgba(225,29,72,1) 0%, rgba(0,212,255,1) 100%)"
			height="5px"
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
