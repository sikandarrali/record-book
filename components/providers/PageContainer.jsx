import { cn } from "@/lib/utils";
import Navbar from "../nav/Navbar";

const PageContainer = ({ children, hideNavbar, className, noPadding }) => {
	return (
		<div
			className={cn(
				"flex flex-col w-full min-h-screen relative gap-4",
				noPadding && "p-0 gap-0",
				className
			)}
		>
			{!hideNavbar && <Navbar />}
			<div className={cn(
				'px-6 flex flex-col w-full relative',
				noPadding && "p-0",
			)}>
				{children}
			</div>
		</div>
	);
};

export default PageContainer;
