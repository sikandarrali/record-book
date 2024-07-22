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
			xs: `text-xs ${isUrdu && "leading-7"}`,
			sm: `text-xs ${isUrdu && "leading-7.5"}`,
			body: `text-sm ${isUrdu && "leading-8"}`,
			lg: `text-base ${isUrdu && "leading-10"}`,
			heading: `text-lg font-semibold ${isUrdu && "leading-12"}`,
			button: `text-sm font-semibold ${isUrdu && "-mt-1 leading-10"}`,
			label: `text-sm font-medium ${isUrdu && "mb-1"}`
		},
		{
			name: "base",
			xs: `text-xs ${isUrdu && "leading-7"}`,
			sm: `text-sm ${isUrdu && "leading-8"}`,
			body: `text-base ${isUrdu && "leading-9"}`,
			lg: `text-lg ${isUrdu && "leading-11"}`,
			heading: `text-xl font-semibold ${isUrdu && "leading-12"}`,
			button: `text-base font-semibold ${isUrdu && "-mt-1 leading-10"}`,
			label: `text-base font-medium ${isUrdu && "mb-1"}`
		},
		{
			name: "lg",
			xs: `text-sm ${isUrdu && "leading-7.5"}`,
			sm: `text-base ${isUrdu && "leading-8.5"}`,
			body: `text-lg ${isUrdu && "leading-10"}`,
			lg: `text-xl ${isUrdu && "leading-11"}`,
			heading: `text-2xl font-semibold ${isUrdu && "leading-14"}`,
			button: `text-lg font-semibold ${isUrdu && "-mt-1 leading-15"}`,
			label: `text-lg font-medium ${isUrdu && "mb-0.5"}`
		},
		{
			name: "xl",
			xs: `text-lg ${isUrdu && "leading-8.5"}`,
			sm: `text-lg ${isUrdu && "leading-9.5"}`,
			body: `text-xl ${isUrdu && "leading-12"}`,
			lg: `text-2xl ${isUrdu && "leading-13"}`,
			heading: `text-3xl font-semibold ${isUrdu && "leading-14 pb-3"}`,
			button: `text-xl font-semibold ${isUrdu && "-mt-1 leading-16"}`,
			label: `text-xl font-medium ${isUrdu && "mb-3"}`
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