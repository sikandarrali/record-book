import Providers from "@/components/providers/Providers";

export default async function RootLayout({ children }) {

	return (
		<Providers>
			{children}
		</Providers>
	);
}
