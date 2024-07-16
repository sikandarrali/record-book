import { cn } from "@/lib/utils";

const UIText = ({ className, variant, weight, isUrdu, ...props }) => {
	return (
		<span
			className={cn(
				"ltr:text-lg rtl:text-xl rtl:font-urdu relative",
				variant === "xs" && "text-base",
				variant === "sm" && "text-lg",
				variant === "heading" && "ltr:font-semibold ltr:text-xl rtl:text-2xl",
				variant === "button" && "rtl:text-xl",
				variant === "label" && "ltr:text-lg ltr:font-medium rtl:text-xl",
				isUrdu ? 'font-urdu' : 'font-sans',
				weight === 'medium' && 'font-medium',
				weight === 'semibold' && 'font-semibold',
				weight === 'bold' && 'font-bold',
				className
			)}
			{...props}
		/>
	);
}

export default UIText
