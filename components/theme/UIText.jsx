import { cn } from "@/lib/utils";

const UIText = ({ children, className, variant, noSpacing, ...props }) => {
	return (
		<span
			className={cn(
				"ltr:text-lg rtl:text-right rtl:font-urdu",
				variant === "xs" && "ltr:text-xs",
				variant === "sm" && "ltr:text-sm rtl:text-base",
				variant === "h1" && "ltr:text-2xl ltr:font-semibold",
				variant === "h2" && "ltr:text-xl ltr:font-semibold",
				variant === "h3" && "ltr:text-lg ltr:font-semibold",
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
};

export default UIText;
