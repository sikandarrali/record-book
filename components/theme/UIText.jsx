import { cn } from "@/lib/utils";

const UIText = ({ className, variant, weight, isUrdu, ...props }) => {
	return (
		<span
			className={cn(
				"ltr:text-lg rtl:text-xl rtl:font-urdu relative",
				variant === "xs" && "rtl:text-base ltr:text-sm ltr:font-medium",
				variant === "sm" && "text-lg",
				variant === "heading" && "ltr:font-semibold ltr:text-xl rtl:text-2xl",
				variant === "button" && "rtl:text-xl ltr:text-lg",
				variant === "label" && "ltr:text-lg ltr:font-medium rtl:text-xl",
				isUrdu ? 'font-urdu' : 'font-sans',
				weight === 'medium' && 'ltr:font-medium',
				weight === 'semibold' && 'ltr:font-semibold',
				weight === 'bold' && 'ltr:font-bold',
				className
			)}
			{...props}
		/>
	);
}

export default UIText
