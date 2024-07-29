import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {SupportedFontSizes, SupportedLanguages, SupportedThemes} from "@/lib/defaultData";
import {LOCAL_THEME_NAME, DEFAULT_THEME} from "@/lib/defaults";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const FixStickyHeaderScrollError = (scrollRef) => {
	const element = scrollRef.current;
	if (
		element &&
		!element.classList.contains("sticky") &&
		!element.classList.contains("fixed")
	) {
		element.scrollIntoView({ behavior: "smooth" });
	}
};

export const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
};

export const GetCurrentLanguage = (value) =>{
	return SupportedLanguages.find((lang)=> lang.value===value)?.value
}

export const GetCurrentFontSize = (value) =>{
	return SupportedFontSizes.find((fontSize)=> fontSize.value===value)?.value
}

export const GetCurrentTheme = (value) =>{
	const isTheme = SupportedThemes.some((key)=> key.name === value);
	if(isTheme){
		return SupportedThemes.find((key)=> key.name === value);
	}
	return DEFAULT_THEME;
}

export const isFontSizeAllowed = (userPref) => {
	const allowedFontSizes = ["sm", "base", "lg", "xl"]
	return allowedFontSizes.includes(userPref)
}

