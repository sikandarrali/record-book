import { cn } from "@/lib/utils";
import Navbar from "../nav/Navbar";

const PageContainer = ({ children, hideNavbar, className, noPadding }) => {
	return (
		<div
			className={cn(
				"flex flex-col w-screen min-h-screen relative pt-4 gap-4",
				noPadding && "p-0 gap-0",
				className
			)}
		>
			{!hideNavbar && <Navbar />}
			<div className={cn(
				'px-6',
				noPadding && "p-0",
			)}>
				{children}
			</div>
		</div>
	);
};

export default PageContainer;
