import { cn } from "@/lib/utils";
import TopBar from "../nav/TopBar";

const PageContainer = ({ children, hideTopbar, className }) => {
	return (
		<div className={cn("flex flex-col mt-11 relative px-4", className)}>
			{!hideTopbar && <TopBar />}
			<div>{children}</div>
		</div>
	);
};

export default PageContainer;
