import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {SupportedFontSizes, SupportedLanguages} from "@/lib/defaultData";

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

export const isFontSizeAllowed = (userPref) => {
	const allowedFontSizes = ["sm", "base", "lg", "xl"]
	return allowedFontSizes.includes(userPref)
}

