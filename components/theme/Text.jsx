import { cn } from "@/lib/utils";

const Text = ({ children, className, variant, urdu, ...props }) => {
	return (
		<p
			className={cn(
				"text-base",
				variant === "xs" && "text-xs",
				variant === "sm" && "text-sm",
				variant === "h1" && "text-2xl font-semibold",
				variant === "h2" && "text-xl font-semibold",
				variant === "h3" && "text-lg font-semibold",
				urdu && "font-urdu",
				className,
				{...props}
			)}
		>
			{children}
		</p>
	);
};

export default Text;
