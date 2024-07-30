import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	SupportedCurrencies,
	SupportedFontSizes,
	SupportedLanguages,
	SupportedThemes
} from "@/lib/defaultData";
import {DEFAULT_CURRENCY, DEFAULT_THEME} from "@/lib/defaults";

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
	const isFound = SupportedThemes.some((key)=> key.name === value);
	if(isFound){
		return SupportedThemes.find((key)=> key.name === value);
	}
	return DEFAULT_THEME;
}

export const isFontSizeAllowed = (userPref) => {
	const allowedFontSizes = ["sm", "base", "lg", "xl"]
	return allowedFontSizes.includes(userPref)
}

export const SortItemsByDateAndCreatedAt = (data) => {
	return [...data].sort((a, b) => {
		const dateA = a.date ? new Date(a.date) : null;
		const dateB = b.date ? new Date(b.date) : null;

		if (dateA && dateB) {
			if (dateA > dateB) return -1;
			if (dateA < dateB) return 1;
		} else if (dateA) {
			return -1;
		} else if (dateB) {
			return 1;
		}

		const createdAtA = new Date(a.createdAt);
		const createdAtB = new Date(b.createdAt);

		if (createdAtA > createdAtB) return -1;
		if (createdAtA < createdAtB) return 1;

		return 0;
	});
}

export const getCurrentCurrency = (value) => {

	const isFound = SupportedCurrencies.some((key)=> key.name === value);
	if(isFound){
		return SupportedCurrencies.find((key)=> key.name === value);
	}
	return DEFAULT_CURRENCY;
}