import {cn, isFontSizeAllowed} from "@/lib/utils";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {cva} from "class-variance-authority";
import {useAuth} from "@/components/contexts/AuthContext";

const UIText = ({ className, variant, weight, text, ...props }) => {

	const {user} = useAuth()
	const isUrdu = isStringUrdu(text)
	const prefs = user?.prefs

	const fontSize = isFontSizeAllowed(prefs?.fontSize) ? prefs.fontSize : 'base';

	const typography = [
		{
			name: "sm",
			xs: `text-xs ${isUrdu ? "leading-7 text-right" : "text-left"}`,
			sm: `text-xs ${isUrdu ? "leading-7.5 text-right" : "text-left"}`,
			body: `text-sm ${isUrdu ? "leading-8 text-right" : "text-left"}`,
			lg: `text-base ${isUrdu ? "leading-10 text-right" : "text-left"}`,
			heading: `text-lg font-semibold ${isUrdu ? "leading-12 text-right" : "text-left"}`,
			button: `text-sm font-semibold ${isUrdu ? "-mt-1 leading-10 text-right" : "text-left"}`,
			label: `text-sm font-medium ${isUrdu ? "mb-1 text-right" : "text-left"}`,
		},
		{
			name: "base",
			xs: `text-xs ${isUrdu ? "leading-7 text-right" : "text-left"}`,
			sm: `text-sm ${isUrdu ? "leading-8 text-right" : "text-left"}`,
			body: `text-base ${isUrdu ? "leading-9 text-right" : "text-left"}`,
			lg: `text-lg ${isUrdu ? "leading-11 text-right" : "text-left"}`,
			heading: `text-xl font-semibold ${isUrdu ? "leading-12 text-right" : "text-left"}`,
			button: `text-base font-semibold ${isUrdu ? "-mt-1 leading-10 text-right" : "text-left"}`,
			label: `text-base font-medium ${isUrdu ? "mb-1 text-right" : "text-left"}`,
		},
		{
			name: "lg",
			xs: `text-sm ${isUrdu ? "leading-7.5 text-right" : "text-left"}`,
			sm: `text-base ${isUrdu ? "leading-8.5 text-right" : "text-left"}`,
			body: `text-lg ${isUrdu ? "leading-10 text-right" : "text-left"}`,
			lg: `text-xl ${isUrdu ? "leading-11 text-right" : "text-left"}`,
			heading: `text-2xl font-semibold ${isUrdu ? "leading-14 text-right" : "text-left"}`,
			button: `text-lg font-semibold ${isUrdu ? "-mt-1 leading-15 text-right" : "text-left"}`,
			label: `text-lg font-medium ${isUrdu ? "mb-0.5 text-right" : "text-left"}`,
		},
		{
			name: "xl",
			xs: `text-base ${isUrdu ? "leading-8.5 text-right" : "text-left"}`,
			sm: `text-lg ${isUrdu ? "leading-9.5 text-right" : "text-left"}`,
			body: `text-xl ${isUrdu ? "leading-12 text-right" : "text-left"}`,
			lg: `text-2xl ${isUrdu ? "leading-13 text-right" : "text-left"}`,
			heading: `text-3xl font-semibold ${isUrdu ? "leading-14 pb-3 text-right" : "text-left"}`,
			button: `text-xl font-semibold ${isUrdu ? "-mt-1 leading-16 text-right" : "text-left"}`,
			label: `text-xl font-medium ${isUrdu ? "mb-3 text-right" : "text-left"}`,
		}
	]

	const typographyMap = typography.reduce((map, item) => {
		map[item.name] = item;
		return map;
	}, {});
	const selectedTypography = typographyMap[fontSize];

	const textVariants = cva(["relative", `${isUrdu ? "font-urdu" : "font-sans"}`, selectedTypography.body], {
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
			className={cn(textVariants({variant, weight, className}))}
			{...props}
		>
			{text}
		</span>
	);
}

export default UIText