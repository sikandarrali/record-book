import { cn } from "@/lib/utils";
import Navbar from "../nav/Navbar";

const PageContainer = ({ children, hideNavbar, className }) => {
	return (
		<div
			className={cn(
				"flex flex-col min-h-screen relative px-6 bg-muted/50",
				className
			)}
		>
			{!hideNavbar && <Navbar />}
			{children}
		</div>
	);
};

export default PageContainer;
