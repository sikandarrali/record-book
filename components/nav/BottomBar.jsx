import { cn } from "@/lib/utils";
import { HomeIcon, Menu, Plus } from "lucide-react";

const BottomBar = () => {
	return (
		<div className="fixed bottom-0 bg-muted w-full pt-2 pb-4 px-8 flex justify-between border-t-4 border-t-muted-foreground/10">
			<IconWrapper icon={<HomeIcon />} />
			<IconWrapper
				icon={<Plus className="text-white w-10 h-10" />}
				className={
					"h-16 w-16 absolute left-1/2 -translate-x-1/2 -top-4 bg-primary hover:bg-primary/90"
				}
			/>
			<IconWrapper icon={<Menu />} />
		</div>
	);
};

export default BottomBar;

const IconWrapper = ({ icon, className }) => {
	return (
		<div
			className={cn(
				"w-12 h-12 flex items-center justify-center rounded-full hover:bg-card",
				className
			)}
		>
			{icon}
		</div>
	);
};
