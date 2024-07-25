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
				'p-6 py-8 flex flex-col w-full relative bg-white dark:bg-black flex-1 rounded-t-[40px] shadow-xl',
			)}>
				{children}
			</div>
		</div>
	);
};

export default PageContainer;
