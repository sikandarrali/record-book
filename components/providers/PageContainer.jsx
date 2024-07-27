import { cn } from "@/lib/utils";
import Navbar from "../nav/Navbar";

const PageContainer = ({ children, hideNavbar, className }) => {
	return (
		<div
			className={cn(
				"flex flex-col w-full min-h-screen relative",
				className
			)}
		>
			{!hideNavbar && <Navbar />}
			<div className={cn(
				'p-6 py-8 flex flex-col w-full bg-white border-t border-border shadow-top-only dark:bg-black/70 relative flex-1 rounded-t-[40px]',
			)}>
				{children}
			</div>
		</div>
	);
};

export default PageContainer;
