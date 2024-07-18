import { cn } from "@/lib/utils";

const UIText = ({ className, variant, weight, isUrdu, children, ...props }) => {
	return (
		<span
			className={cn(
				"ltr:text-lg rtl:text-xl rtl:font-urdu relative",
				variant === "xs" && "rtl:text-base ltr:text-sm ltr:font-medium",
				variant === "sm" && "text-lg",
				variant === "lg" && "ltr:text-lg rtl:text-xl",
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
		>
			{children}
		</span>
	);
}

export default UIText