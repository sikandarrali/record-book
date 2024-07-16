import { cn } from "@/lib/utils";

const UIText = ({ className, variant, isUrdu, ...props }) => {
	return (
		<span
			className={cn(
				"text-xl rtl:font-urdu relative",
				variant === "xs" && "text-base",
				variant === "sm" && "text-lg",
				variant === "heading" && "text-2xl",
				variant === "button" && "rtl:text-xl",
				variant === "label" && "rtl:text-xl",
				isUrdu ? 'font-urdu' : 'font-sans',
				className
			)}
			{...props}
		/>
	);
}

export default UIText
