import { Loader2Icon } from "lucide-react";

const Loader = () => {
	return (
		<div className="px-10 py-16 flex flex-col gap-3 items-center justify-center ">
			<Loader2Icon className="animate-spin text-primary w-8 h-8" />
			<span className="font-medium text-muted-foreground">
				Loading data, pleas wait...
			</span>
		</div>
	);
};

export default Loader;
