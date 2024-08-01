import {cn, isFontSizeAllowed} from "@/lib/utils";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {cva} from "class-variance-authority";
import {useAuth} from "@/components/contexts/AuthContext";

const UIText = ({ className, variant, weight, text, textOrientation, ...props }) => {

	const {user} = useAuth()
	const isUrdu = isStringUrdu(text)
	const prefs = user?.prefs

	const fontSize = isFontSizeAllowed(prefs?.fontSize) ? prefs.fontSize : 'base';

	const typography = [
		{
			name: "sm",
			xs: `text-xs ${isUrdu && "leading-7"} rtl:text-right`,
			sm: `text-xs ${isUrdu && "leading-7.5"} rtl:text-right`,
			body: `text-sm ${isUrdu && "leading-8"} rtl:text-right`,
			lg: `text-base ${isUrdu && "leading-10"} rtl:text-right`,
			heading: `text-lg font-semibold ${isUrdu && "leading-12"} rtl:text-right`,
			button: `text-sm font-semibold ${isUrdu && "-mt-1 leading-10"} rtl:text-right`,
			label: `text-sm font-medium ${isUrdu && "mb-1"} rtl:text-right`,
		},
		{
			name: "base",
			xs: `text-xs ${isUrdu && "leading-7"} rtl:text-right`,
			sm: `text-sm ${isUrdu && "leading-8"} rtl:text-right`,
			body: `text-base ${isUrdu && "leading-9"} rtl:text-right`,
			lg: `text-lg ${isUrdu && "leading-11"} rtl:text-right`,
			heading: `text-xl font-semibold ${isUrdu && "leading-12"} rtl:text-right`,
			button: `text-base font-semibold ${isUrdu && "-mt-1 leading-10"} rtl:text-right`,
			label: `text-base font-medium ${isUrdu && "mb-1"} rtl:text-right`,
		},
		{
			name: "lg",
			xs: `text-sm ${isUrdu && "leading-7.5"} rtl:text-right`,
			sm: `text-base ${isUrdu && "leading-8.5"} rtl:text-right`,
			body: `text-lg ${isUrdu && "leading-10"} rtl:text-right`,
			lg: `text-xl ${isUrdu && "leading-11"} rtl:text-right`,
			heading: `text-2xl font-semibold ${isUrdu && "leading-14"} rtl:text-right`,
			button: `text-lg font-semibold ${isUrdu && "-mt-1 leading-15"} rtl:text-right`,
			label: `text-lg font-medium ${isUrdu && "mb-0.5"} rtl:text-right`,
		},
		{
			name: "xl",
			xs: `text-sm ${isUrdu && "leading-8.5"} rtl:text-right`,
			sm: `text-lg ${isUrdu && "leading-9.5"} rtl:text-right`,
			body: `text-xl ${isUrdu && "leading-12"} rtl:text-right`,
			lg: `text-2xl ${isUrdu && "leading-13"} rtl:text-right`,
			heading: `text-3xl font-semibold ${isUrdu && "leading-14 pb-3"} rtl:text-right`,
			button: `text-xl font-semibold ${isUrdu && "-mt-1 leading-16"} rtl:text-right`,
			label: `text-xl font-medium ${isUrdu && "mb-3"} rtl:text-right`,
		}
	]

	const typographyMap = typography.reduce((map, item) => {
		map[item.name] = item;
		return map;
	}, {});
	const selectedTypography = typographyMap[fontSize];

	const textVariants = cva([
		"relative",
		`${isUrdu ? "font-urdu" : "font-sans"}`,
		selectedTypography.body
	], {
		variants: {
			variant: {
				xs: selectedTypography.xs,
				sm: selectedTypography.sm,
				body: selectedTypography.body,
				lg: selectedTypography.lg,
				heading: selectedTypography.heading,
				button: selectedTypography.button,
				label: selectedTypography.label,
			},
			weight: {
				light: "font-light",
				normal: "font-normal",
				medium: "font-medium",
				semibold: "font-semibold",
				bold: "font-bold",
				black: "black"
			}
		},
		defaultVariants: {
			variant: "body",
		},
	});

	return (
		<span
			className={cn(
				textVariants({variant, weight, className}),
				textOrientation === "right" && "!text-right rtl:!text-right",
				textOrientation === "left" && "!text-left rtl:!text-left",
				textOrientation === "center" && "!text-left rtl:!text-center"
			)}
			{...props}
		>
			{text}
		</span>
	);
}

export default UIText